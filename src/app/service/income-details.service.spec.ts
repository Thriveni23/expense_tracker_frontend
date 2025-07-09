import { TestBed } from '@angular/core/testing';

import { IncomeDetailsService } from './income-details.service';

describe('IncomeDetailsService', () => {
  let service: IncomeDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
