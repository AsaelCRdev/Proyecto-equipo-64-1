import { TestBed } from '@angular/core/testing';

import { MovieRentalService } from './movie-rental-service';

describe('MovieRentalService', () => {
  let service: MovieRentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieRentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
