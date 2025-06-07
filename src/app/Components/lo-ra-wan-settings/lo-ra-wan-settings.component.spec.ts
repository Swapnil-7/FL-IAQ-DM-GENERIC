import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoRaWANSettingsComponent } from './lo-ra-wan-settings.component';

describe('LoRaWANSettingsComponent', () => {
  let component: LoRaWANSettingsComponent;
  let fixture: ComponentFixture<LoRaWANSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoRaWANSettingsComponent]
    });
    fixture = TestBed.createComponent(LoRaWANSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
