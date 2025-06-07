import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SerialCommandComponent } from './Components/serial-command/serial-command.component';
import { DeviceDetailComponent } from './Components/device-detail/device-detail.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { AdminComponent } from './Components/admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, RouterModule, withHashLocation } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './Components/auth/login/login.component';
import { GeneralComponent } from './Components/general/general.component';
import { ProtocolComponent } from './Components/protocol/protocol.component';
import { MqttComponent } from './Components/mqtt/mqtt.component';
import { ConnectivityComponent } from './Components/connectivity/connectivity.component';
import { ServerSettingComponent } from './Components/server-setting/server-setting.component';
import { SensorComponent } from './Components/sensor/sensor.component';
import { DeviceConfigurationComponent } from './Components/device-configuration/device-configuration.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { LoRaWANSettingsComponent } from './Components/lo-ra-wan-settings/lo-ra-wan-settings.component';


@NgModule({
   declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    LayoutComponent,
    DeviceDetailComponent,
    SerialCommandComponent,
     GeneralComponent,
    ProtocolComponent,
    MqttComponent,
    ConnectivityComponent,
    ServerSettingComponent,
    SensorComponent,
    DeviceConfigurationComponent,
    ConfigurationComponent,
    LoRaWANSettingsComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
     RouterModule,
     FormsModule,
     CommonModule,
     HttpClientModule,
  ],
  providers: [provideRouter(routes, withHashLocation())],
  bootstrap: [AppComponent]
})
export class AppModule { }
