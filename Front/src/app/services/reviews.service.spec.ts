import { TestBed } from '@angular/core/testing';

import { Reviews } from './reviews.service';

describe('Reviews', () => {
  let service: Reviews;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reviews);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
