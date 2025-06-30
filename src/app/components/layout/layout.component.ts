import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  activeRoute: string = '';
  isSidebarOpen: boolean = true;
  deviceStatus: any;
  hostname: any;
  deviceName: string | null = null;
  firmwareVersion: string | null = null;
  isMenuOpen1 = false;
  isMenuOpen2 = false;
  
  private unsubscriber = new Subject<void>();

  constructor(
    private router: Router, 
    private dev: DeviceService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });

    this.dev.deviceName$
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(name => this.deviceName = name);

    this.dev.firmwareVersion$
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(version => this.firmwareVersion = version);
    
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Initialization logic
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isActive(route: string): boolean {
    return this.activeRoute === `/${route}`;
  }

  logout() {
    this.dev.clearStoredValues();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  onResize(event: any) {
    this.checkScreenSize();
  }

  toggleProtocolMenu(menuNumber: number) {
    switch(menuNumber) {
      case 1:
        this.isMenuOpen1 = !this.isMenuOpen1;
        break;
      case 2:
        this.isMenuOpen2 = !this.isMenuOpen2;
        break;
    }
  }

  reboot(): void {
    this.dev.reboot({ cmd: "reset" }).subscribe({
      next: (result: any) => {
        console.log(result);
        alert('Device Reboot Successfully');
      },
      error: (error: any) => {
        console.error('reboot error', error);
        alert('Error occurred while rebooting device');
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}