import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; // ✅ Add FormBuilder here
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent {

  sensors = [
    { label: 'eCO2', slop: 'eco2Slop', const: 'eco2Const' },
    { label: 'CH2O', slop: 'ch2oSlop', const: 'ch2oConst' },
    { label: 'TVOC', slop: 'tvocSlop', const: 'tvocConst' },
    { label: 'PM2.5', slop: 'pm2_5Slop', const: 'pm2_5Const' },
    { label: 'PM10', slop: 'pm10Slop', const: 'pm10Const' },
    { label: 'Temperature', slop: 'tempSlop', const: 'tempConst' },
    { label: 'Humidity', slop: 'humSlop', const: 'humConst' },
    { label: 'CO', slop: 'coSlop', const: 'coConst' },
  ];

  formData: any;
  sensorForm: FormGroup;  
  spinnerVisible = false;

  constructor(
    private fb: FormBuilder, 
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sensorForm = this.fb.group({
      eco2Slop: [''], eco2Const: [''],
      ch2oSlop: [''], ch2oConst: [''],
      tvocSlop: [''], tvocConst: [''],
      pm2_5Slop: [''], pm2_5Const: [''],
      pm10Slop: [''], pm10Const: [''],
      tempSlop: [''], tempConst: [''],
      humSlop: [''], humConst: [''],
      coSlop: [''], coConst: ['']
    });
  }

  ngOnInit() {
    this.getSensorSet();
  }

  getSensorSet() {
    this.spinnerVisible=true;
     
    this.deviceService.getSensor().subscribe(
      (result: any) => {
        this.sensorForm.patchValue(result);
        console.log("GET Sensor-Calibration", result);
        this.formData = result;
        this.spinnerVisible=false;
      },
      (err: any) => {
        console.error(err.message);
        alert("An error occurred while fetching data");
        this.spinnerVisible=false;
      }
    );

   
  }

  saveSensor() {
    console.log("Save sensor calibration", this.sensorForm.value);
    this.deviceService.setSensor(this.sensorForm.value).subscribe(
      (result: any) => {
        if (result.sts === true) {
          alert('Sensor Calibration Updated Successfully');
        } else {
          alert('Sensor Calibration Failed to update');
        }
      },
      (err: any) => {
        console.error(err.message);
        alert("An error occurred while updating sensor calibration data");
      }
    );
  }

  ngOnDestroy(): void {}
}
