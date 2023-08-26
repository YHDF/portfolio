import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCarouselComponent } from './custom-carousel.component';

describe('CustomCarouselComponent', () => {
  let component: CustomCarouselComponent;
  let fixture: ComponentFixture<CustomCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomCarouselComponent]
    });
    fixture = TestBed.createComponent(CustomCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
