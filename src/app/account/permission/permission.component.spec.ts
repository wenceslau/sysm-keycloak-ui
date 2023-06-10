import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionComponent } from './permission.component';

describe('PermissionComponent', () => {
  let component: PermissionComponent;
  let fixture: ComponentFixture<PermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionComponent]
    });
    fixture = TestBed.createComponent(PermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
