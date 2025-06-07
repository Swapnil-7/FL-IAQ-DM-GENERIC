import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HostnameService {

  private _hostnameSubject = new BehaviorSubject<any>('HostName');
  
  get hostname$(): Observable<any> {
    return this._hostnameSubject.asObservable();
  }

  setHostname(hostname: any): void {
    this._hostnameSubject.next(hostname);
  }
 
}
