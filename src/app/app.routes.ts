import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SerialCommandComponent } from './components/serial-command/serial-command.component';
import { DeviceDetailComponent } from './components/device-detail/device-detail.component';
import { AdminComponent } from './components/admin/admin.component';
import { MqttComponent } from './components/mqtt/mqtt.component';
import { ConnectivityComponent } from './components/connectivity/connectivity.component';
import { GeneralComponent } from './components/general/general.component';
import { ServerSettingComponent } from './components/server-setting/server-setting.component';
import { DeviceConfigurationComponent } from './components/device-configuration/device-configuration.component';
import { SensorComponent } from './components/sensor/sensor.component';
import { LoRaWANSettingsComponent } from './components/lo-ra-wan-settings/lo-ra-wan-settings.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'serial-command', 
        component: SerialCommandComponent 
      },
      { 
        path: 'device-detail', 
        component: DeviceDetailComponent 
      },
      {
        path: 'protocol',
        children: [
          { 
            path: 'mqtt', 
            component: MqttComponent 
          }
        ]
      },
      { 
        path: 'connectivity', 
        component: ConnectivityComponent 
      },
      { 
        path: 'general', 
        component: GeneralComponent 
      },
      { 
        path: 'server', 
        component: ServerSettingComponent 
      },
      { 
        path: 'dev-config', 
        component: DeviceConfigurationComponent 
      },
      { 
        path: 'admin', 
        component: AdminComponent 
      },
      { 
        path: 'sensor', 
        component: SensorComponent 
      },
      { 
        path: 'lora', 
        component: LoRaWANSettingsComponent 
      }
    ]
  }
];