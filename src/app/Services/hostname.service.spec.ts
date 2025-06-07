import { TestBed } from '@angular/core/testing';

import { HostnameService } from './hostname.service';

describe('HostnameService', () => {
  let service: HostnameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostnameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
