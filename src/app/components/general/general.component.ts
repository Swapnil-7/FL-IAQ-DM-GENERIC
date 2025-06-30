import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit, OnDestroy {
  formData: any;
  updatedFormData: any;
  updatedFormField: any;
  spinnerVisible = false;
  
  private unsubscriber = new Subject<void>();

  configForm = new FormGroup({
    hostname: new FormControl(''),
    lattitude: new FormControl(''),
    longitude: new FormControl(''),
    sitename: new FormControl(''),
    clientname: new FormControl(''),
    deviceAlias: new FormControl(''),
    logstorage: new FormControl(),
    logsend: new FormControl(),
  });

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.getGeneral();
  }

  getGeneral() {
    this.spinnerVisible = true;
    
    this.deviceService.getGnConfig().subscribe({
      next: (result: any) => {
        console.log('GET GENERAL', result);
        this.configForm.patchValue(result);
        this.formData = result;
        this.spinnerVisible = false;
      },
      error: (err: any) => {
        console.error(err.message);
        alert('An error occurred while fetching data');
        this.spinnerVisible = false;
      }
    });
  }

  handleRetainChange() {
    const logstorageValue = this.configForm.get('logstorage')?.value;
    console.log('Logstorage Value:', logstorageValue);
  }

  saveConfig() {
    console.log('SAVE GENERAL ', this.configForm.value);
    
    this.deviceService.saveGnConfig(this.configForm.value).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.sts === true) {
          alert('General Configuration Setting Update Successfully');
        } else {
          alert('General Configuration Failed to update');
        }
      },
      error: (err: any) => {
        console.error(err.message);
        alert('An error occurred while updating General Configuration Setting');
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}