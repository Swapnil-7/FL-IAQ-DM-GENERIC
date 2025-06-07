import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from 'src/app/Services/device.service';
import { HostnameService } from 'src/app/Services/hostname.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  passwordForm: FormGroup;
  telnetForm!: FormGroup;
  spinnerVisible: boolean = false;
  selectedOption: string | null = null;
  password1: string = '';
  password2: string = '';
  telnet: number | null = null;
  // selectedOpt: string = '';
  selectedFile: File | null = null;
  constructor(private http: HttpClient, private deviceService: DeviceService, private fb: FormBuilder, private hostServ:HostnameService) {
    this.passwordForm = this.fb.group({
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });

    // this.telnetForm = this.fb.group({
    //   telnet: ['']
    // })


  }
  hostname: any = '';
  ngOnInit(): void {
    this.telnetForm = this.fb.group({
      telnet: ['']
    });
    this.getTelnet()
  }
  getTelnet() {
    this.deviceService.getTelnet().subscribe(
      (response: any) => {
        console.log('GET TELNET:', response);
        this.telnetForm.patchValue(response);
        // alert("Data Restore Successfully");
      },
      (error: any) => {
        console.error('Restore error:', error);
        alert("Error Occured while fetching Telnet Data");
        // Handle the error as needed
      }
    );
  }

  downloadJsonFile(jsonData: JSON) {
    this.hostServ.hostname$.subscribe((result: any) => {
      this.hostname = result.Device;
    });


    // Convert JSON data to a string
    const jsonString = JSON.stringify(jsonData, null, 2); // Optional: add formatting (indentation of 2 spaces)

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Prompt the user for a new file name
    const newFileName = window.prompt('Enter a new file name:', this.hostname + '.json');

    // If the user provides a new name, use it; otherwise, cancel the download
    if (newFileName && newFileName.trim() !== '') {
      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);

      // Set the file name
      downloadLink.download = newFileName.trim();

      // Append the link to the document
      document.body.appendChild(downloadLink);

      // Trigger a click on the link to start the download
      downloadLink.click();

      // Remove the link from the document
      document.body.removeChild(downloadLink);
    }
  }

  selectOption(value: number) {
    this.telnetForm.patchValue({ telnet: value });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  onFileSelected1(event: any): void {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log(this.selectedFile, this.selectedFile?.type);
      // console.log(fileInput);

      if (this.selectedFile) {
        if (this.selectedFile?.type === 'application/json') {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const fileContent = e.target?.result as string;
              const jsonData = JSON.parse(fileContent);

              if (jsonData && typeof jsonData === 'object') {
                console.log('File is in JSON format', jsonData);
                this.restoreData(jsonData);

                // Now you can use jsonData as needed
              } else {
                console.error('Invalid JSON format');
                alert('Invalid JSON format')
                // Handle invalid JSON format
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
              alert('Error parsing JSON: Invalid JSON format')
              // Handle JSON parsing error
            }
            this.fileNameInput = '';
          };
          reader.readAsText(this.selectedFile);

        } else {
          // USE JSON FILE ONLY
          alert('USE JSON FILE ONLY')
        }
      } else {
        // NO FILE SELECTED
        alert('NO FILE SELECTED')
      }
      // this.restoreData();
    } else {
      this.selectedFile = null;
      alert('ERROR')
      // Handle case where no file is selected, if needed
    }
  }

  triggerFileInput(): void {
    // Trigger the click event on the file input
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }


  restoreData(jsonData: any): void {
    this.deviceService.saveRestore(jsonData).subscribe(
      (response:any) => {
        console.log('Restore successful:', response);
        alert("Data Restore Successfully");
      },
      (error:any) => {
        console.error('Restore error:', error);
        alert("Error Occured while Restore Data");
        // Handle the error as needed
      }
    );
    this.fileNameInput = '';

    // Optionally, you can reset the file input value to clear the selection

  }



  saveTelnet() {
    console.log("Set Telnet", this.telnetForm.value);
    this.deviceService.setTelnet(this.telnetForm.value).subscribe((result:any) => {
      console.log('telnet', result);
      alert('Telnet Setting Update Successfully');
    }, (error:any) => {
      console.error('API error:', error);
      alert('Error Occured while Update Telnet Setting');
    })
  }

  fileNameInput: any;
  upgrade() {
    if (!this.fileNameInput) {
      alert('Please select a file before upgrading.');
      return;
    }

    const fileInput = document.getElementById('file1') as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const filename = selectedFile.name;
      const formData: FormData = new FormData();
      formData.append('file', selectedFile, filename);

      this.spinnerVisible = true;

      // Set the headers to 'multipart/form-data' to send the file content as FormData
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      this.deviceService.update(formData, headers).subscribe((res: any) => {
        console.log("UPGRADE API RES", res);
        if (res.sts === true) {
          alert('File upgrade successful');
        } else {
          alert('Fail to upgrade');
        }
        this.spinnerVisible = false;

      }, (error:any) => {
        console.log(error);
        this.spinnerVisible = false;
        alert('File Not Upgrade: ');
      })
      this.fileNameInput = '';


    } else {
      alert('No file selected for upgrading.');
      this.spinnerVisible = false;
    }
  }

  convertToPlainText(fileContent: any): string {
    if (typeof fileContent === 'string') {
      // If the file content is already a string, return it as is
      return fileContent;
    } else if (fileContent instanceof ArrayBuffer) {
      // If the file content is an ArrayBuffer (binary data), attempt to convert it to text
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(fileContent);
    } else {
      // If it's not a string or binary data, you may need to handle other cases based on your specific requirements
      console.error('Unsupported file type or content');
      return ''; // Or handle the unsupported type accordingly
    }
  }

  onFileSelection(event: any): void {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0] as File;
      this.fileNameInput = selectedFile.name; // Only store the filename
      let filename: string = selectedFile.name;
      if (filename !== 'firmware.bin' && filename !== 'spiffs.bin') {
        alert('Invalid file selected. Please select either "firmware.bin" or "spiffs.bin".');
        // Clear the file input to reset the selection
        event.target.value = '';
        return;
      }

      console.log('File Name:', this.fileNameInput);

    } else {
      this.fileNameInput = '';
    }
  }
  onSubmit() {
    // Handle form submission here
    if (this.passwordForm.valid) {
      // console.log('Form submitted successfully');
      this.deviceService.adminPassword(this.passwordForm.value).subscribe((result:any) => {
        console.log(result);
        alert('password change successfully');

      }, (error:any) => {
        console.log(error);
        alert('please check password');

      })
    }

  }

  // Custom validator to check if passwords match
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password1 = control.get('password1')?.value;
    const password2 = control.get('password2')?.value;

    return password1 === password2 ? null : { 'PasswordNoMatch': true };

  }

  // onSubmitClick() {
  //   if (this.passwordForm.invalid) {
  //     // Show an alert or perform any other action
  //     alert('Form is invalid. Please fill in all required fields and correct validation errors.');
  //   }
  // }

  backupFirm() {
    this.deviceService.getBackupFirm()
      .subscribe(
        (response: any) => {
          console.log('API response:', response);
          this.downloadJsonFile(response)
          alert('Backup created successfully');
        },
        (error:any) => {
          console.error('API error:', error);
          alert('Error Occured while creating backup');
          // Handle the error as needed
        }
      );
  }

  setFactory() {
    const userConfirmed = window.confirm('Are you sure you want to restore to factory setting');

    if (userConfirmed) {

      this.deviceService.saveFactory({ cmd: "factoryset" }).subscribe(
        (result: any) => {
          console.log(result);
          alert('Factory Reset successfully .');
        },
        (error: any) => {
          console.error(error);
          alert('Error occurred during Factory Reset.');
        }
      );
    } else {
      console.log('Factory reset canceled .');
    }
  }







  ngOnDestroy(): void {

  }



}
