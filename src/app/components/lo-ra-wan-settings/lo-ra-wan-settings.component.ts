import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-lo-ra-wan-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lo-ra-wan-settings.component.html',
  styleUrls: ['./lo-ra-wan-settings.component.css']
})
export class LoRaWANSettingsComponent implements OnInit, OnDestroy {
  formData: any;
  updatedFormData: any;
  updatedFormField: any;
  hexPattern = '^[0-9A-Fa-f]{8}$';
  spinnerVisible = false;
  
  loraForm = new FormGroup({
    LRWAN: new FormControl(''),
    DeviAddr: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9A-Fa-f]{8}$/)
    ]),
    NetwkSesKey: new FormControl('', [
      Validators.required,  
      Validators.pattern(/^[0-9A-Fa-f]{32}$/)
    ]),
    AppSesKey: new FormControl('', [
      Validators.required,  
      Validators.pattern(/^[0-9A-Fa-f]{32}$/)
    ]),
  });

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.getLoraSet();
    this.setupFormSubscriptions();
  }

  private setupFormSubscriptions() {
    this.loraForm.get('LRWAN')?.valueChanges.subscribe((newValue: any) => {
      const mappedValue = newValue ? 1 : 0;
      console.log('Updated value of LORAWN checkbox:', mappedValue);

      if (mappedValue === 0) {
        this.loraForm.get('DeviAddr')?.disable();
        this.loraForm.get('NetwkSesKey')?.disable();
        this.loraForm.get('AppSesKey')?.disable();
      } else {
        this.loraForm.get('DeviAddr')?.enable();
        this.loraForm.get('NetwkSesKey')?.enable();
        this.loraForm.get('AppSesKey')?.enable();
      }
    });
  }

  validateHexInput(event: any) {
    const input = event.target.value.toUpperCase();
    const filteredInput = input.replace(/[^0-9A-F]/g, '');
    event.target.value = filteredInput;
  }

  getLoraSet() {
    this.spinnerVisible = true;
    
    this.deviceService.getLora().subscribe({
      next: (result: any) => {
        console.log("GET Lora", result);
        this.loraForm.patchValue(result);
        this.formData = result;
        this.spinnerVisible = false;
      },
      error: (err: any) => {
        console.error(err.message);
        alert("An error occurred while fetching data.");
        this.spinnerVisible = false;
      }
    });
  }

  enforceHex(event: any): void {
    const originalValue = event.target.value;
    const filteredValue = originalValue.toLowerCase().replace(/[^0-9A-Fa-f]/g, '');
    if (filteredValue !== originalValue) {
      event.target.value = filteredValue;
    }

    const controlName = event.target.getAttribute('formControlName');
    if (controlName) {
      this.loraForm.get(controlName)?.setValue(filteredValue, { emitEvent: false });
    }
  }

  saveLoraSet() {
    let p = {
      DeviAddr: this.loraForm.get('DeviAddr')?.value,
      NetwkSesKey: this.loraForm.get('NetwkSesKey')?.value,
      LRWAN: this.loraForm.get('LRWAN')?.value ? 1 : 0,
      AppSesKey: this.loraForm.get('AppSesKey')?.value,
    };
    
    console.log(p);
    
    this.deviceService.setLora(p).subscribe({
      next: (result: any) => {
        console.log("save Lora", result);
        alert('Lora setting update successfully');
      },
      error: (err: any) => {
        console.error(err);
        alert('Error updating Lora settings');
      }
    });
  }

  ngOnDestroy(): void {}
}