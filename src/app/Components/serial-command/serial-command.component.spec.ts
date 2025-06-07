import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialCommandComponent } from './serial-command.component';

describe('SerialCommandComponent', () => {
  let component: SerialCommandComponent;
  let fixture: ComponentFixture<SerialCommandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerialCommandComponent]
    });
    fixture = TestBed.createComponent(SerialCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
