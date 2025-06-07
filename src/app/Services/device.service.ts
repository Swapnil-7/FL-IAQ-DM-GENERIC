import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private variableSubject = new BehaviorSubject<boolean>(false); // Replace 'string' with the actual type of your variable
  variable$: Observable<boolean> = this.variableSubject.asObservable();

  private _deviceName$ = new BehaviorSubject<string>(localStorage.getItem('deviceName') || '');
  private _firmwareVersion$ = new BehaviorSubject<string>(localStorage.getItem('firmwareVersion') || '');

  deviceName$ = this._deviceName$.asObservable();
  firmwareVersion$ = this._firmwareVersion$.asObservable();

 

  constructor(private http: HttpClient, private router: Router) { }


 
  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  // getLogin(body: any) {
  //   return this.http.get('http://localhost:8008/api/login');
  // }

  // getLogin(body: any) {
  //   return this.http.get(`${environment.URL}/api/login`);
  // }


  // getLogin(data: any) {
  //   return this.http.post(`${environment.URL}/api/login`, data);
  // }

  getLogin(data: any) {
    return this.http.post(`${environment.URL}/api/login`, data);
  }
  // getStatus() {
  //   return this.http.get('http://localhost:8008/api/status');
  // }

  getStatus() {
    return this.http.get(`${environment.URL}/api/status`);
  }

   setDeviceName(name: string) {
    localStorage.setItem('deviceName', name);
    this._deviceName$.next(name);
  }

  setFirmwareVersion(version: string) {
    localStorage.setItem('firmwareVersion', version);
    this._firmwareVersion$.next(version);
  }
  getServerSetting() {
    return this.http.get(`${environment.URL}/api/getserverset`);
  }

  setServerSetting(data: any) {
    return this.http.post(`${environment.URL}/api/setserverset`, data);
  }

  getDeviceConfig() {
    return this.http.get(`${environment.URL}/api/getdevconf`);
  }

  setDeviceConfig(data: any) {
    return this.http.post(`${environment.URL}/api/setdevconf`, data);
  }

  saveGnConfig(data: any) {
    return this.http.post(`${environment.URL}/api/general`, data);
  }

  getGnConfig() {
    return this.http.get(`${environment.URL}/api/general`);
  }

  getSensor() {
    return this.http.get(`${environment.URL}/api/getsenscalib`);
  }
  setSensor(data: any) {
    return this.http.post(`${environment.URL}/api/setsenscalib`, data)

  }

  getLora() {
    return this.http.get(`${environment.URL}/api/getloraSettings`);
  }
  setLora(data: any) {
    return this.http.post(`${environment.URL}/api/setloraSettings`, data)

  }

   clearStoredValues() {
    localStorage.removeItem('deviceName');
    localStorage.removeItem('firmwareVersion');
    this._deviceName$.next('');
    this._firmwareVersion$.next('');
  }

  // getConfiguration() {
  //   return this.http.get(`${environment.URL}/api/getConfiguration`);
  // }
  // setConfiguration(data: any) {
  //   return this.http.post(`${environment.URL}/api/setConfiguration`, data)

  // }

  getCloudSetting() {
    return this.http.get(`${environment.URL}/api/cloudset`);
  }

  setCloudSetting(data: any) {
    return this.http.post(`${environment.URL}/api/cloudset`, data);

  }

  getWifiSsid() {
    return this.http.get(`${environment.URL}/api/getinterface`);
  }

  getMqtt() {
    return this.http.get(`${environment.URL}/api/mqtt`);
  }

  saveMqtt(data: any) {
    return this.http.post(`${environment.URL}/api/mqtt`, data);

  }


  getConn() {
    return this.http.get(`${environment.URL}/api/getconnectivity`);
  }

  setConn(data: any) {
    return this.http.post(`${environment.URL}/api/setconnectivity`, data);

  }

  getCellularConfig() {
    return this.http.get(`${environment.URL}/api/getcellular`);
  }

  saveCellularConfig(data: any) {
    return this.http.post(`${environment.URL}/api/savecellular`, data);

  }

  reboot(data: any) {
    return this.http.post(`${environment.URL}/reboot`, data);
  }

  setCommand(data: any) {
    return this.http.post(`${environment.URL}/serial/cmd`, data);
  }

  adminPassword(data: any) {
    return this.http.post(`${environment.URL}/api/changeP`, data);

  }

  getBackupFirm() {
    return this.http.get(`${environment.URL}/api/backup`);
  }


  setTelnet(data: any) {
    return this.http.post(`${environment.URL}/api/telnet`, data);
  }

  getTelnet() {
    return this.http.get(`${environment.URL}/api/telnet`);
  }

  getBackup() {
    return this.http.get(`${environment.URL}/api/backup`);
  }
  setBackup(data: any) {
    return this.http.post(`${environment.URL}/api/backup`, data);
  }

  saveFactory(data: any) {
    return this.http.post(`${environment.URL}/api/factroryReset`, data);

  }

  saveRestore(data: any) {
    return this.http.post(`${environment.URL}/api/restore`, data);
  }
  


  update(formData: any, headers: any) {
    return this.http.post(`${environment.URL}/api/update`, formData, { headers });
    // const timeoutDuration = 15000; // Specify the timeout duration in milliseconds (e.g., 10 seconds)

    // return this.http.post(`${environment.URL}/api/update`, formData, { headers })
    //   .pipe(
    //     timeout(timeoutDuration), // Set the timeout duration
    //     catchError(this.handleError) // Handle errors
    //   );
    
  }

  private handleError(error: any): Observable<never> {
    // Handle HTTP errors here
    console.error('HTTP error occurred:', error);
    return throwError('HTTP error occurred');
  }
}
