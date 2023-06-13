import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionDialogComponent } from './permission-dialog.component';

describe('PermissionDialogComponent', () => {
  let component: PermissionDialogComponent;
  let fixture: ComponentFixture<PermissionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionDialogComponent]
    });
    fixture = TestBed.createComponent(PermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
