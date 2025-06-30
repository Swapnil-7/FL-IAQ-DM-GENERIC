import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-mqtt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.css']
})
export class MqttComponent implements OnInit, OnDestroy {
  formData: any;
  updatedFormData: any;
  updatedFormField: any;
  spinnerVisible = false;
  selectedOption: string | null = null;

  constructor(
    private http: HttpClient, 
    private deviceService: DeviceService
  ) {}

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

  onFileChange(event: any, controlName: string) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
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

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  ngOnInit(): void {
    this.getMqtt();
  }

  getMqtt() {
    this.spinnerVisible = true;
    
    this.deviceService.getMqtt().subscribe({
      next: (result: any) => {
        console.log("GET Mqtt", result);
        this.mqttForm.patchValue(result);
        this.formData = result;
        this.spinnerVisible = false;
      },
      error: (err: any) => {
        console.error(err.message);
        alert("An error occurred while fetching data");
        this.spinnerVisible = false;
      }
    });
  }

  handleRetainChange() {
    const retainValue = this.mqttForm.get('retain')?.value;
    console.log('Retain Value:', retainValue);
  }

  saveMqtt() {
    console.log("save mqtt setting", this.mqttForm.value);
    this.mqttForm.value.enable_mqtt = Number(this.mqttForm.value.enable_mqtt);
    this.mqttForm.value.port = Number(this.mqttForm.value.port);
    this.mqttForm.value.qos = Number(this.mqttForm.value.qos);
    this.mqttForm.value.userSecureConnection = Number(this.mqttForm.value.userSecureConnection);

    this.updatedFormData = this.mqttForm.value;
    
    this.deviceService.saveMqtt(this.updatedFormData).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.sts === true) {
          alert('MQTT Setting Update Successfully');
        } else {
          alert('MQTT Setting Failed to update');
        }
      },
      error: (err: any) => {
        console.error(err.message);
        alert("An error occurred while updating MQTT Setting");
      }
    });
  }

  downloadFile(fileType: string) {
    const certificatesGroup = this.mqttForm.get('certificates') as FormGroup;
    const fileContent = certificatesGroup.get(fileType)?.value;

    if (fileContent) {
      const blob = new Blob([fileContent], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${fileType}.pem`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}