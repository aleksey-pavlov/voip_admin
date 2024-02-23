/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TrunksService } from './trunks.service';

describe('TrunksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrunksService]
    });
  });

  it('should ...', inject([TrunksService], (service: TrunksService) => {
    expect(service).toBeTruthy();
  }));
});
