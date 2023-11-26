import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ThreeIndicatorComponent} from './three-indicator.component';

describe('ThreeIndicatorComponent', () => {
  let component: ThreeIndicatorComponent;
  let fixture: ComponentFixture<ThreeIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeIndicatorComponent]
    });
    fixture = TestBed.createComponent(ThreeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
