import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCreditsComponent } from './icon-credits.component';

describe('IconCreditsComponent', () => {
  let component: IconCreditsComponent;
  let fixture: ComponentFixture<IconCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconCreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
