import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-device-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './device-configuration.component.html',
  styleUrls: ['./device-configuration.component.css']
})
export class DeviceConfigurationComponent implements OnInit {
  formData: any;
  spinnerVisible = false;
  
  deviceConfigForm = new FormGroup({
    urate: new FormControl(),
    modaddr: new FormControl(),
    stinterval: new FormControl(),
  });

  constructor(
    private deviceService: DeviceService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getDeviceConf();
  }

  getDeviceConf() {
    this.spinnerVisible = true;
    
    this.deviceService.getDeviceConfig().subscribe({
      next: (result: any) => {
        console.log("GET Device-Configuration", result);
        this.deviceConfigForm.patchValue(result);
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

  saveDeviceConfig() {
    console.log("save device configuration", this.deviceConfigForm.value);
    
    this.deviceService.setDeviceConfig(this.deviceConfigForm.value).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.sts === true) {
          alert('Device Configuration Setting Update Successfully');
        } else {
          alert('Device Configuration Failed to update');
        }
      },
      error: (err: any) => {
        console.error(err.message);
        alert("An error occurred while updating Device Configuration Setting");
      }
    });
  }
}