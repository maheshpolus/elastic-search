import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppElasticComponent } from './app-elastic.component';

describe('AppElasticComponent', () => {
  let component: AppElasticComponent;
  let fixture: ComponentFixture<AppElasticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppElasticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppElasticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
