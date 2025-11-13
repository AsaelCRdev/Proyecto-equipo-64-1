import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerPanel } from './buyer-panel';

describe('BuyerPanel', () => {
  let component: BuyerPanel;
  let fixture: ComponentFixture<BuyerPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
