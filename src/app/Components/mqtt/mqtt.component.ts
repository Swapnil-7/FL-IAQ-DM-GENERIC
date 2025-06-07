import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-mqtt',
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.css']
})
export class MqttComponent {

  formData: any;
  updatedFormData: any;
  updatedFormField: any;
   spinnerVisible = false;
  constructor(private http: HttpClient, private deviceService: DeviceService) {

  }

  mqttForm = new FormGroup({
    enable_mqtt: new FormControl(),
    broker: new FormControl(''),
    certificates: new FormGroup({
      ca: new FormControl(''),
      crt: new FormControl(''),
      key: new FormControl(''),
    }),
    port: new FormControl(),
    user: new FormControl(''),
    pwd: new FormControl(''),
    cid: new FormControl(''),
    qos: new FormControl(),
    retain: new FormControl(),
    keep_alive: new FormControl(),
    userSecureConnection: new FormControl(0),
    pubtopic: new FormControl(''),
    attrpubtopic: new FormControl(''),
    subtopic: new FormControl(''),
  });


  //onFileChange method, reads the content of a file, and updates a specific control in a form. The selectOption method is involved in selecting and storing options.
  onFileChange(event: any, controlName: string) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader(); //It creates a new FileReader to read the contents of the selected file as text.
      reader.onload = () => {  //The onload event of the reader is used to handle the completion of the file reading.
        const result: string = (reader.result as string) ?? '';

        console.log(this.mqttForm.get(`certificates.${controlName}`));
        console.log(result);

        const certificatesGroup = this.mqttForm.get('certificates') as FormGroup;
        certificatesGroup.setValue({
          ...certificatesGroup.value,
          [controlName]: result,
        });
      };
      reader.readAsText(file);
    }
  }
  selectedOption: string | null = null;
  

  selectOption(option: string): void { //This method takes an option parameter (a string) and sets the selectedOption property to that value.
    this.selectedOption = option;
  }

  ngOnInit(): void {
    this.getMqtt();

  }

  getMqtt() {
    this.spinnerVisible=true;
    // setTimeout(() => {
    this.deviceService.getMqtt().subscribe((result: any) => {
      console.log("GET Mqtt", result);
      this.mqttForm.patchValue(result);
      this.formData = result;
      this.spinnerVisible=false;
      // console.log(this.formData);

      // console.log(this.formData.retain);
    }, (err:any) => {
      console.error(err.message);
      alert("An error Occured While fetching data");
       this.spinnerVisible=false;
    });
    // }, 2000);
  }

  handleRetainChange() {
    const retainValue = this.mqttForm.get('retain')?.value;
    console.log('Retain Value:', retainValue);
    // Perform additional actions if needed
  }
  saveMqtt() {
    console.log("save mqtt setting", this.mqttForm.value);
    this.mqttForm.value.enable_mqtt = Number(this.mqttForm.value.enable_mqtt);
    this.mqttForm.value.port = Number(this.mqttForm.value.port);
    this.mqttForm.value.qos = Number(this.mqttForm.value.qos);
    this.mqttForm.value.userSecureConnection = Number(this.mqttForm.value.userSecureConnection);


    this.updatedFormData = this.mqttForm.value;
    this.deviceService.saveMqtt(this.updatedFormData).subscribe((result: any) => {
      console.log(result);
      if (result.sts === true) {
        alert('MQTT  Setting Update Successfully');
      } else {
        alert('MQTT  Setting Failed to update');
      }
    }, (err:any) => {
      console.error(err.message);
      alert("An error Occured While Update MQTT Setting");
    });

  }

  downloadFile(fileType: string) {
    const certificatesGroup = this.mqttForm.get('certificates') as FormGroup;
    const fileContent = certificatesGroup.get(fileType)?.value;

    if (fileContent) {  //If the file content is available, it creates a Blob from the content with the MIME type 'application/octet-stream'. A Blob is a binary large object representing raw data.
      const blob = new Blob([fileContent], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      //Creating a Downloadable URL: It creates a URL for the Blob using window.URL.createObjectURL(blob).



      // Create a temporary anchor element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${fileType}.pem`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Release the URL object
      window.URL.revokeObjectURL(url);
    }


  }
  ngOnDestroy(): void {

  }



}
