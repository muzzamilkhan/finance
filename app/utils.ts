export const SECONDS_IN_DAY = 24 * 60 * 60;

export function currencyFormat(n: number) {
  const converter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return converter.format(n);
}

export function numberFormat(n: number): string {
  const c = currencyFormat(n);

  return c.replace('$', '');
}
