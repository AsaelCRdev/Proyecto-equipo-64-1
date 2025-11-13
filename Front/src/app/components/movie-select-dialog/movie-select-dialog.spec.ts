import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSelectDialog } from './movie-select-dialog';

describe('MovieSelectDialog', () => {
  let component: MovieSelectDialog;
  let fixture: ComponentFixture<MovieSelectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieSelectDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieSelectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
