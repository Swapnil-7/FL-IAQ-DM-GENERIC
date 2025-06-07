import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/auth/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { SerialCommandComponent } from './Components/serial-command/serial-command.component';
import { DeviceDetailComponent } from './Components/device-detail/device-detail.component';
import { AdminComponent } from './Components/admin/admin.component';
import { MqttComponent } from './Components/mqtt/mqtt.component';
import { ConnectivityComponent } from './Components/connectivity/connectivity.component';
import { GeneralComponent } from './Components/general/general.component';
import { ServerSettingComponent } from './Components/server-setting/server-setting.component';
import { DeviceConfigurationComponent } from './Components/device-configuration/device-configuration.component';
import { SensorComponent } from './Components/sensor/sensor.component';
import { LoRaWANSettingsComponent } from './Components/lo-ra-wan-settings/lo-ra-wan-settings.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  // { path: 'login', component: LoginComponent },
  
  // // Protect these routes with AuthGuard
  // {
  //   path: '',
  //   component: LayoutComponent,
   
  //   children: [
  //     { path: 'serial-command', component:SerialCommandComponent },
  //     { path: 'device-detail', component:DeviceDetailComponent },
  //     {path:'admin',component:AdminComponent},
  //     {path:'Modbus-tcp',component:ModbusTcpComponent},
  //   ]
  // }  


  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  
  // Protect these routes with AuthGuard
  {
    path: '',
    component: LayoutComponent,
   
    children: [
      { path: 'serial-command', component:SerialCommandComponent },
      { path: 'device-detail', component:DeviceDetailComponent },
      // { path: 'device-status', component:DeviceStatusComponent },
      {
        path: 'protocol',
        children: [
            { path: 'mqtt', component: MqttComponent }
        ]
    },
    {path:'connectivity',component:ConnectivityComponent},
    { path: 'general', component:GeneralComponent },
    { path: 'server', component:ServerSettingComponent },
    // { path: 'configuration', component:ConfigurationComponent },
    {path:'dev-config', component:DeviceConfigurationComponent},
    {path:'admin',component:AdminComponent},
     {path:'sensor',component:SensorComponent},
     {path:'lora',component:LoRaWANSettingsComponent}

  
   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
