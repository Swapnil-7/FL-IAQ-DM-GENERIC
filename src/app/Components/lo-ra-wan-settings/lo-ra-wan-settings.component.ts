import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-lo-ra-wan-settings',
  templateUrl: './lo-ra-wan-settings.component.html',
  styleUrls: ['./lo-ra-wan-settings.component.css']
})
export class LoRaWANSettingsComponent {

  formData: any;
  updatedFormData: any;
  updatedFormField: any;
  hexPattern = '^[0-9A-Fa-f]{8}$'; // Exactly 8 hexadecimal characters
  spinnerVisible = false;
  
  loraForm = new FormGroup({
    LRWAN: new FormControl('',),
    DeviAddr: new FormControl('', [Validators.required,
    Validators.pattern(/^[0-9A-Fa-f]{8}$/)]),
    NetwkSesKey: new FormControl('', [Validators.required,  Validators.pattern(/^[0-9A-Fa-f]{32}$/)]),
    AppSesKey: new FormControl('', [Validators.required,  Validators.pattern(/^[0-9A-Fa-f]{32}$/)]),
     
  });

  constructor(
    private deviceService: DeviceService
  ) {}

  ngOnInit() {
    this.getLoraSet();
  this.loraForm.get('LRWAN')?.valueChanges.subscribe((newValue:any) => {
      const mappedValue = newValue ? 1 : 0;
      console.log('Updated value of LORAWN checkbox:', mappedValue);
      //  console.log('Updated value of DHCP checkbox:', mappedValue);

      // You can perform further actions based on the updated value
      if (mappedValue === 0) {
        // Checkbox is checked
        Object.keys(this.loraForm.controls).forEach(controlName => {
          if (controlName !== 'LRWAN') {
           

             this.loraForm.get('DeviAddr')?.disable();
      this.loraForm.get('NetwkSesKey')?.disable();
      this.loraForm.get('AppSesKey')?.disable();
          }
        });
      } else {
       
         this.loraForm.get('DeviAddr')?.enable();
      this.loraForm.get('NetwkSesKey')?.enable();
      this.loraForm.get('AppSesKey')?.enable();
    }
    
    });

  }

  validateHexInput(event: any) {
    const input = event.target.value.toUpperCase(); // Convert to uppercase
    const filteredInput = input.replace(/[^0-9A-F]/g, ''); // Allow only hex characters
    event.target.value = filteredInput; // Update the input field
  }

  getLoraSet() {
    this.spinnerVisible=true;
    // setTimeout(() => {
    this.deviceService.getLora().subscribe((result:any) => {
      console.log("GET Lora", result);
      this.loraForm.patchValue(result);
      this.formData = result;
      this.spinnerVisible=false;
    }, (err:any) => {
      console.error(err.message);
      alert("An error occurred while fetching data.");
      this.spinnerVisible=false;
    });
  // },2000);
  }

  enforceHex(event: any): void {
  const originalValue = event.target.value;
  const filteredValue = originalValue.toLowerCase().replace(/[^0-9A-Fa-f]/g, '');
  if (filteredValue !== originalValue) {
    event.target.value = filteredValue;
  }

  // Also update form control explicitly if needed
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
      
    }
    console.log(p)
    this.deviceService.setLora(p).subscribe((result: any) => {
      console.log("save Lora", result)

    });
    

    alert('Lora setting update successfully');
  
  }

  ngOnDestroy(): void {}

}
