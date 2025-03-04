import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberCheckerComponent } from './number-checker.component';

describe('NumberCheckerComponent', () => {
  let component: NumberCheckerComponent;
  let fixture: ComponentFixture<NumberCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberCheckerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
