import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieConfigDialog } from './movie-config-dialog';

describe('MovieConfigDialog', () => {
  let component: MovieConfigDialog;
  let fixture: ComponentFixture<MovieConfigDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieConfigDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieConfigDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
