import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-device-configuration',
  templateUrl: './device-configuration.component.html',
  styleUrls: ['./device-configuration.component.css']
})
export class DeviceConfigurationComponent {

  formData: any;
  spinnerVisible = false;
  deviceConfigForm = new FormGroup({
    urate: new FormControl(),
    modaddr: new FormControl(),
    stinterval: new FormControl(),
    // reboottime: new FormControl(''),
  })
  constructor(private deviceService: DeviceService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getDeviceConf();

  }


  getDeviceConf() {
    // Fetch initial configuration from the server if not found in localStorage
    this.spinnerVisible=true;
    //  setTimeout(() => {
    this.deviceService.getDeviceConfig().subscribe((result: any) => {
      console.log("GET Device-Configuration", result);
      this.deviceConfigForm.patchValue(result);
      this.formData = result;
      this.spinnerVisible=false;
    }, (err:any) => {
      console.error(err.message);
      alert("An error Occured While fetching data");
      this.spinnerVisible=false;
    });
  // },2000);
  }

  saveDeviceConfig() {
    console.log("save device configuration", this.deviceConfigForm.value);
    this.deviceService.setDeviceConfig(this.deviceConfigForm.value).subscribe((result: any) => {
      console.log(result);
      if (result.sts === true) {
        alert('Device Configuration Setting Update Successfully');
      } else {
        alert('Device Configuration Failed to update');
      }
    }, (err:any) => {
      console.error(err.message);
      alert("An error Occured While Update Device Configuration Setting");
    });

  }


}
