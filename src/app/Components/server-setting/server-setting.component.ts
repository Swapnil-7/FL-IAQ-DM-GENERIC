import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-server-setting',
  templateUrl: './server-setting.component.html',
  styleUrls: ['./server-setting.component.css']
})
export class ServerSettingComponent {
    spinnerVisible = false;
  formData: any;
  serverForm = new FormGroup({
    serverIP: new FormControl(''),
    port: new FormControl(),
    serverURL: new FormControl(''),
    token: new FormControl(''),
  })
  constructor(private deviceService: DeviceService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getServer();
  }
  getServer() {
    // Fetch initial configuration from the server if not found in localStorage
     this.spinnerVisible = true; 
    //  setTimeout(() => {
    this.deviceService.getServerSetting().subscribe((result: any) => {
      console.log("GET Server-Setting", result);
      this.serverForm.patchValue(result);
      this.formData = result;
      this.spinnerVisible = false;
      // console.log(this.formData);
    }, (err:any) => {
      console.error(err.message);
      alert("An error Occured While fetching data");
       this.spinnerVisible = false;
    });
  // },2000);

  }




  updateServer() {
    // this.serverForm.value.port = Number(this.serverForm.value.port);
    console.log("save server setting", this.serverForm.value);
    this.deviceService.setServerSetting(this.serverForm.value).subscribe((result: any) => {
      console.log(result);
      if (result.sts === true) {
        alert('Server Setting Update Successfully');
      } else {
        alert('Server Setting Failed to update');
      }
    }, (err:any) => {
      console.error(err.message);
      alert('An Error  Occured while Updating Server setting');
    });
  }

  ngOnDestroy(): void {

  }

}
