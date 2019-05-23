import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInstallationStatusComponent } from './app-installation-status.component';

describe('AppInstallationStatusComponent', () => {
  let component: AppInstallationStatusComponent;
  let fixture: ComponentFixture<AppInstallationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppInstallationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInstallationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
