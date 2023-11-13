import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OptionMenuComponent} from './option-menu.component';

describe('OptionMenuComponent', () => {
  let component: OptionMenuComponent;
  let fixture: ComponentFixture<OptionMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionMenuComponent]
    });
    fixture = TestBed.createComponent(OptionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
