import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent {
  deviceStatus: any;
  spinnerVisible = false; // <-- add this

  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.getDeviceStatus();
  }

  getDeviceStatus(): void {
    console.log("Status page");
    this.spinnerVisible = true; // Show spinner before API call

    this.deviceService.getStatus().subscribe(
      (result: any) => {
        this.deviceStatus = result;

        if (result?.Device) {
          this.deviceService.setDeviceName(result.Device);
        }

        if (result?.FirmwareVersion) {
          this.deviceService.setFirmwareVersion(result.FirmwareVersion);
        }

        this.spinnerVisible = false; // Hide spinner after success
      },
      (error: any) => {
        console.error('Error fetching status data:', error);
        alert("An error Occurred While fetching status data");
        this.spinnerVisible = false; // Hide spinner on error too
      }
    );
  }
}

