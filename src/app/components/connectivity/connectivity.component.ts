import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-connectivity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connectivity.component.html',
  styleUrls: ['./connectivity.component.css']
})
export class ConnectivityComponent implements OnInit {
  wifiForm = new FormGroup({
    ssid: new FormControl(''),
    password: new FormControl(''),
    dhcp: new FormControl(0),
    staticIP: new FormControl(''),
    gatewayIP: new FormControl(''),
    subnetMask: new FormControl(''),
    pdns: new FormControl(''),
    sdns: new FormControl(''),
    dns: new FormControl(''),
    autoApn: new FormControl(0),
    sim1Apn: new FormControl(''),
  });

  selectedNetwork: 1 | 0 = 1; // Default to WiFi

  constructor(
    private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private deviceService: DeviceService
  ) {}

  ngOnInit(): void {
    this.getConn();
    this.setupFormSubscriptions();
  }

  private setupFormSubscriptions() {
    this.wifiForm.get('autoApn')?.valueChanges.subscribe((newValue: any) => {
      const mappedValue = newValue ? 1 : 0;
      console.log(mappedValue);
      if (mappedValue === 0) {
        this.wifiForm.get('sim1Apn')?.enable();
      } else {
        this.wifiForm.get('sim1Apn')?.disable();
      }
    });

    this.wifiForm.get('dhcp')?.valueChanges.subscribe((newValue: any) => {
      const mappedValue = newValue ? 1 : 0;
      console.log('Updated value of DHCP checkbox:', mappedValue);

      if (mappedValue === 1) {
        this.wifiForm.get('staticIP')?.disable();
        this.wifiForm.get('gatewayIP')?.disable();
        this.wifiForm.get('subnetMask')?.disable();
        this.wifiForm.get('pdns')?.disable();
        this.wifiForm.get('sdns')?.disable();
        this.wifiForm.get('dns')?.disable();
      } else {
        this.wifiForm.get('staticIP')?.enable();
        this.wifiForm.get('gatewayIP')?.enable();
        this.wifiForm.get('subnetMask')?.enable();
        this.wifiForm.get('pdns')?.enable();
        this.wifiForm.get('sdns')?.enable();
        this.wifiForm.get('dns')?.enable();
      }
    });
  }

  getConn() {
    this.deviceService.getConn().subscribe({
      next: (result: any) => {
        console.log("GET Connectivity", result);
        if (result) {
          this.wifiForm.patchValue(result);
          this.selectedNetwork = result.conn;
        }
      },
      error: (err: any) => {
        console.error(err.message);
        alert("An error occurred while fetching data");
      }
    });
  }

  selectWiFi() {
    this.selectedNetwork = 1;
  }

  select4G() {
    this.selectedNetwork = 0;
  }

  saveWiFiSettings() {
    console.log("SELECTED NW", this.selectedNetwork, this.wifiForm);
    
    let p = {
      conn: this.selectedNetwork,
      ssid: this.wifiForm.get('ssid')?.value,
      password: this.wifiForm.get('password')?.value,
      dhcp: this.wifiForm.get('dhcp')?.value ? 1 : 0,
      staticIP: this.wifiForm.get('staticIP')?.value,
      gatewayIP: this.wifiForm.get('gatewayIP')?.value,
      subnetMask: this.wifiForm.get('subnetMask')?.value,
      pdns: this.wifiForm.get('pdns')?.value,
      sdns: this.wifiForm.get('sdns')?.value,
      dns: this.wifiForm.get('dns')?.value,
      autoApn: this.wifiForm.get('autoApn')?.value,
      sim1Apn: this.wifiForm.get('sim1Apn')?.value,
    };
    
    console.log(p);
    
    this.deviceService.setConn(p).subscribe({
      next: (result: any) => {
        console.log("save Connectivity", result);
        alert('Connectivity setting update successfully');
      },
      error: (err: any) => {
        console.error(err);
        alert('Error updating connectivity settings');
      }
    });
  }
}