import {
  organizationScopedBody,
  organizationScopedQuery,
} from './organization-scope.util';

describe('organization scope utilities', () => {
  const request = {
    user: {
      organizationId: 'org-a',
      branchId: 'delhi',
    },
  } as never;

  it('overrides client supplied query organization and branch with session scope', () => {
    expect(
      organizationScopedQuery(
        {
          organizationId: 'org-b',
          branchId: 'dubai',
          page: 1,
          limit: 20,
        },
        request,
      ),
    ).toMatchObject({ organizationId: 'org-a', branchId: 'delhi' });
  });

  it('overrides client supplied body organization and branch with session scope', () => {
    expect(
      organizationScopedBody(
        { organizationId: 'org-b', branchId: 'dubai', name: 'Lead' },
        request,
      ),
    ).toMatchObject({
      organizationId: 'org-a',
      branchId: 'delhi',
      name: 'Lead',
    });
  });
});
