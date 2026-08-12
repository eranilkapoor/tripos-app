export function toMinorUnits(value: unknown) {
  return Math.round(Number(value ?? 0) * 100);
}

export function fromMinorUnits(value: unknown) {
  return Number(value ?? 0) / 100;
}

export function calculateTaxMinor(subtotalMinor: number, taxRate: number) {
  return Math.round(subtotalMinor * (Number(taxRate || 0) / 100));
}
