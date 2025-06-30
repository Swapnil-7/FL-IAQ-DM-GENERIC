import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-serial-command',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './serial-command.component.html',
  styleUrls: ['./serial-command.component.css']
})
export class SerialCommandComponent implements OnInit {
  formData: any;
  updatedFormData: any;
  updatedFormField: any;
  
  CommandForm = new FormGroup({
    command: new FormControl(''),
  });

  constructor(
    private deviceService: DeviceService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialization logic
  }

  saveCommand() {
    this.deviceService.setCommand({ cmd: this.CommandForm.value.command }).subscribe({
      next: (result: any) => {
        this.formData = result;
        console.log("Command sent:", { cmd: this.CommandForm.value.command });
        console.log(result);

        if (result.sts === true) {
          alert('Command Update Successfully');
        } else {
          alert('Failed to update Command');
        }
      },
      error: (err: any) => {
        console.error(err.message);
        alert("An error occurred while updating command");
      }
    });
  }
}