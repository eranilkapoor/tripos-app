import { calculateTaxMinor, fromMinorUnits, toMinorUnits } from './money.util';

describe('money utilities', () => {
  it('converts decimal money to integer minor units without float drift', () => {
    expect(toMinorUnits(1295.555)).toBe(129556);
    expect(toMinorUnits(0.1 + 0.2)).toBe(30);
    expect(fromMinorUnits(129556)).toBe(1295.56);
  });

  it('calculates tax in minor units', () => {
    expect(calculateTaxMinor(10974600, 18)).toBe(1975428);
  });
});
