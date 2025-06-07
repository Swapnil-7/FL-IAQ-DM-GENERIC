import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-serial-command',
  templateUrl: './serial-command.component.html',
  styleUrls: ['./serial-command.component.css']
})
export class SerialCommandComponent {

  formData: any;
  updatedFormData: any;
  updatedFormField: any;
  CommandForm = new FormGroup({
  command: new FormControl(''),

  })




  constructor(private deviceService: DeviceService, private router: Router) {

  }

  ngOnInit(): void {

  }






  saveCommand() {
    this.deviceService.setCommand({ cmd: this.CommandForm.value.command }).subscribe((result: any) => {
      this.formData = result;
      console.log("Command sent:", { cmd: this.CommandForm.value.command }); // Print the command value
      console.log(result);

      if (result.sts === true) {
        alert('Command Update Successfully');
        // this.router.navigate(['home/status']);
      } else {
        alert('Failed to update Command');
      }
    }, (err:any) => {
      console.error(err.message);
      alert("An error Occured While Update command");
    });


  }


}
