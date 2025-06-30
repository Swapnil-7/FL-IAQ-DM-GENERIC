import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeviceService } from '../../../services/device.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  private variableSubject = new BehaviorSubject<boolean>(false);
  variable$: Observable<boolean> = this.variableSubject.asObservable();

  constructor(
    private router: Router, 
    private builder: FormBuilder, 
    private deviceService: DeviceService
  ) {
    this.loginForm = this.builder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      alert('Please enter username and password');
      return;
    }

    this.deviceService.getLogin(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log(this.loginForm.value);
        console.log(res);
        if (res.sts === true) {
          localStorage.setItem("token", res.sts);
          this.router.navigateByUrl('serial-command'); 
          this.variableSubject.next(true);
        } else {
          alert('Invalid username or password');
        }
      },
      error: (err: any) => {
        console.log(err);
        alert("Login Failed");
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}