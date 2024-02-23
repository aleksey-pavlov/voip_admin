import { TestBed, inject } from '@angular/core/testing';

import { SipBalancerService } from './sip-balancer.service';

describe('SipBalancerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SipBalancerService]
    });
  });

  it('should ...', inject([SipBalancerService], (service: SipBalancerService) => {
    expect(service).toBeTruthy();
  }));
});
