import { UnauthorizedException } from '@nestjs/common';
import { PublicLeadsController } from './public-leads.controller';

describe('PublicLeadsController', () => {
  const service = {
    create: jest.fn((payload) => payload),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'production';
    process.env.PUBLIC_LEAD_INTAKE_TOKEN = 'server-token';
    process.env.PUBLIC_LEAD_ORGANIZATION_ID = 'org-public';
    process.env.PUBLIC_LEAD_BRANCH_ID = 'web';
  });

  it('rejects public leads without the server intake token', () => {
    const controller = new PublicLeadsController(service as never);

    expect(() =>
      controller.create({ customerName: 'Demo', source: 'bad' } as never),
    ).toThrow(UnauthorizedException);
  });

  it('ignores client-supplied organization scope and uses server configured scope', () => {
    const controller = new PublicLeadsController(service as never);

    const result = controller.create(
      {
        customerName: 'Demo',
        organizationId: 'attacker-org',
        branchId: 'attacker-branch',
      } as never,
      'server-token',
    );

    expect(result).toMatchObject({
      organizationId: 'org-public',
      branchId: 'web',
      source: 'public-website',
      channel: 'b2c',
    });
  });
});
