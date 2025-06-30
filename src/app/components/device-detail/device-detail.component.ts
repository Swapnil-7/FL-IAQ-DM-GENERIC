import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {
  deviceStatus: any;
  spinnerVisible = false;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.getDeviceStatus();
  }

  getDeviceStatus(): void {
    console.log("Status page");
    this.spinnerVisible = true;

    this.deviceService.getStatus().subscribe({
      next: (result: any) => {
        this.deviceStatus = result;

        if (result?.Device) {
          this.deviceService.setDeviceName(result.Device);
        }

        if (result?.FirmwareVersion) {
          this.deviceService.setFirmwareVersion(result.FirmwareVersion);
        }

        this.spinnerVisible = false;
      },
      error: (error: any) => {
        console.error('Error fetching status data:', error);
        alert("An error occurred while fetching status data");
        this.spinnerVisible = false;
      }
    });
  }
}