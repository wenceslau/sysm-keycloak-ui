import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authorizerGuard } from './authorizer.guard';

describe('authorizerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authorizerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
