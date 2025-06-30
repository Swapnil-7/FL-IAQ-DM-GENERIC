import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DeviceService } from '../../services/device.service';
import { HostnameService } from '../../services/hostname.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup;
  telnetForm!: FormGroup;
  spinnerVisible: boolean = false;
  selectedOption: string | null = null;
  password1: string = '';
  password2: string = '';
  telnet: number | null = null;
  selectedFile: File | null = null;
  hostname: any = '';
  fileNameInput: any;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(
    private http: HttpClient, 
    private deviceService: DeviceService, 
    private fb: FormBuilder, 
    private hostServ: HostnameService
  ) {
    this.passwordForm = this.fb.group({
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.telnetForm = this.fb.group({
      telnet: ['']
    });
    this.getTelnet();
  }

  getTelnet() {
    this.deviceService.getTelnet().subscribe({
      next: (response: any) => {
        console.log('GET TELNET:', response);
        this.telnetForm.patchValue(response);
      },
      error: (error: any) => {
        console.error('Restore error:', error);
        alert("Error occurred while fetching Telnet Data");
      }
    });
  }

  downloadJsonFile(jsonData: JSON) {
    this.hostServ.hostname$.subscribe((result: any) => {
      this.hostname = result.Device;
    });

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const newFileName = window.prompt('Enter a new file name:', this.hostname + '.json');

    if (newFileName && newFileName.trim() !== '') {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = newFileName.trim();
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  selectOption(value: number) {
    this.telnetForm.patchValue({ telnet: value });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  onFileSelected1(event: any): void {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log(this.selectedFile, this.selectedFile?.type);

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
              } else {
                console.error('Invalid JSON format');
                alert('Invalid JSON format');
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
              alert('Error parsing JSON: Invalid JSON format');
            }
            this.fileNameInput = '';
          };
          reader.readAsText(this.selectedFile);
        } else {
          alert('USE JSON FILE ONLY');
        }
      } else {
        alert('NO FILE SELECTED');
      }
    } else {
      this.selectedFile = null;
      alert('ERROR');
    }
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  restoreData(jsonData: any): void {
    this.deviceService.saveRestore(jsonData).subscribe({
      next: (response: any) => {
        console.log('Restore successful:', response);
        alert("Data Restore Successfully");
      },
      error: (error: any) => {
        console.error('Restore error:', error);
        alert("Error occurred while Restore Data");
      }
    });
    this.fileNameInput = '';
  }

  saveTelnet() {
    console.log("Set Telnet", this.telnetForm.value);
    
    this.deviceService.setTelnet(this.telnetForm.value).subscribe({
      next: (result: any) => {
        console.log('telnet', result);
        alert('Telnet Setting Update Successfully');
      },
      error: (error: any) => {
        console.error('API error:', error);
        alert('Error occurred while Update Telnet Setting');
      }
    });
  }

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

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      this.deviceService.update(formData, headers).subscribe({
        next: (res: any) => {
          console.log("UPGRADE API RES", res);
          if (res.sts === true) {
            alert('File upgrade successful');
          } else {
            alert('Fail to upgrade');
          }
          this.spinnerVisible = false;
        },
        error: (error: any) => {
          console.log(error);
          this.spinnerVisible = false;
          alert('File Not Upgrade: ');
        }
      });
      this.fileNameInput = '';
    } else {
      alert('No file selected for upgrading.');
      this.spinnerVisible = false;
    }
  }

  convertToPlainText(fileContent: any): string {
    if (typeof fileContent === 'string') {
      return fileContent;
    } else if (fileContent instanceof ArrayBuffer) {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(fileContent);
    } else {
      console.error('Unsupported file type or content');
      return '';
    }
  }

  onFileSelection(event: any): void {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0] as File;
      this.fileNameInput = selectedFile.name;
      let filename: string = selectedFile.name;
      
      if (filename !== 'firmware.bin' && filename !== 'spiffs.bin') {
        alert('Invalid file selected. Please select either "firmware.bin" or "spiffs.bin".');
        event.target.value = '';
        return;
      }

      console.log('File Name:', this.fileNameInput);
    } else {
      this.fileNameInput = '';
    }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.deviceService.adminPassword(this.passwordForm.value).subscribe({
        next: (result: any) => {
          console.log(result);
          alert('password change successfully');
        },
        error: (error: any) => {
          console.log(error);
          alert('please check password');
        }
      });
    }
  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password1 = control.get('password1')?.value;
    const password2 = control.get('password2')?.value;

    return password1 === password2 ? null : { 'PasswordNoMatch': true };
  }

  backupFirm() {
    this.deviceService.getBackupFirm().subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        this.downloadJsonFile(response);
        alert('Backup created successfully');
      },
      error: (error: any) => {
        console.error('API error:', error);
        alert('Error occurred while creating backup');
      }
    });
  }

  setFactory() {
    const userConfirmed = window.confirm('Are you sure you want to restore to factory setting');

    if (userConfirmed) {
      this.deviceService.saveFactory({ cmd: "factoryset" }).subscribe({
        next: (result: any) => {
          console.log(result);
          alert('Factory Reset successfully.');
        },
        error: (error: any) => {
          console.error(error);
          alert('Error occurred during Factory Reset.');
        }
      });
    } else {
      console.log('Factory reset canceled.');
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}