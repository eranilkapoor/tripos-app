import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacGuard } from './rbac.guard';

function context(method: string, path: string, permissions: string[] = []) {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({
        method,
        originalUrl: `/api/v1/${path}`,
        user: { permissions },
      }),
    }),
  } as never;
}

describe('RbacGuard inferred permissions', () => {
  const reflector = {
    getAllAndOverride: jest.fn(() => undefined),
  } as unknown as Reflector;

  it('requires inferred read permission for protected domain reads', () => {
    const guard = new RbacGuard(reflector);

    expect(
      guard.canActivate(context('GET', 'payments', ['payments:read'])),
    ).toBe(true);
  });

  it('blocks protected domain writes without inferred permission', () => {
    const guard = new RbacGuard(reflector);

    expect(() =>
      guard.canActivate(context('POST', 'payments', ['payments:read'])),
    ).toThrow(ForbiddenException);
  });
});
