import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DeviceService } from 'src/app/Services/device.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  activeRoute: string = '';
  isSidebarOpen: boolean = true;
  deviceStatus: any;
  hostname: any;
  deviceName: string | null = null;
  firmwareVersion: string | null = null;
  private unsubscriber = new Subject<void>();
  constructor(private router: Router, private dev: DeviceService,){
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
   

  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  
  }

  // for activeted route..
  isActive(route: string): boolean {
    return this.activeRoute === `/${route}`;
  }

  logout() {
    // this.loginService.logout();
     this.dev.clearStoredValues();
    this.router.navigate(['/login']);
  }

  // function for sidebar open and close
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
  
  isMenuOpen1 = false;
  isMenuOpen2 = false; // If you have more submenus

  // function for open and close the protocol submenu..
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
 
  // for reboot device..
  reboot(): void {
    this.dev.reboot({ cmd: "reset" }).subscribe(
      (result: any) => {
        console.log(result);
        alert('Device Reboot Successfully');
      },
      (error:any) => {
        console.error('reboot error', error);
        alert('error occure while rebooting device');
      }
    );
  }

 ngOnDestroy(): void {
  this.unsubscriber.next();
  this.unsubscriber.complete();
}


  

}
