import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-server-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './server-setting.component.html',
  styleUrls: ['./server-setting.component.css']
})
export class ServerSettingComponent implements OnInit, OnDestroy {
  spinnerVisible = false;
  formData: any;
  
  serverForm = new FormGroup({
    serverIP: new FormControl(''),
    port: new FormControl(),
    serverURL: new FormControl(''),
    token: new FormControl(''),
  });

  constructor(
    private deviceService: DeviceService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getServer();
  }

  getServer() {
    this.spinnerVisible = true;
    
    this.deviceService.getServerSetting().subscribe({
      next: (result: any) => {
        console.log("GET Server-Setting", result);
        this.serverForm.patchValue(result);
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

  updateServer() {
    console.log("save server setting", this.serverForm.value);
    
    this.deviceService.setServerSetting(this.serverForm.value).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.sts === true) {
          alert('Server Setting Update Successfully');
        } else {
          alert('Server Setting Failed to update');
        }
      },
      error: (err: any) => {
        console.error(err.message);
        alert('An error occurred while updating Server setting');
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}