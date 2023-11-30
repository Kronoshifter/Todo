import { TestBed } from '@angular/core/testing';

import { NetworkAPIService } from './network-api.service';

describe('NetworkAPIService', () => {
  let service: NetworkAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
