import { calculateInvoiceTotals } from './invoices.service';

describe('calculateInvoiceTotals', () => {
  it('returns display totals and minor-unit totals from invoice entries', () => {
    const totals = calculateInvoiceTotals(
      [{ total: 1000.1 }, { total: 2000.2 }],
      18,
    );

    expect(totals.minor).toEqual({
      subtotalMinor: 300030,
      taxAmountMinor: 54005,
      taxBasisMinor: 300030,
      totalPayableMinor: 354035,
    });
    expect(totals.display).toEqual({
      subtotal: 3000.3,
      taxAmount: 540.05,
      taxBasis: 3000.3,
      totalPayable: 3540.35,
    });
  });
});
