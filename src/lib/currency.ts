import type { Money } from "@/lib/types";

/** Units of each currency per 1 US dollar. */
export type ExchangeRates = Record<string, number>;

// Creating an Intl.NumberFormat is slow, so each one is made once and reused
const formatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(
  currency: string,
  locale?: string,
  options?: Intl.NumberFormatOptions,
) {
  const key = `${locale ?? "default"}:${currency}:${JSON.stringify(options ?? {})}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      ...options,
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

/** Decimal places a currency uses: 2 for USD and KES, 0 for JPY. */
export function currencyDecimals(currency: string) {
  return currencyFormatter(currency).resolvedOptions().maximumFractionDigits ?? 2;
}

/**
 * Formats money for display in the user's locale, e.g.
 * formatCurrency({ amount: 2000, currency: "USD" }, "en-US") → "$20.00".
 * Pass { maximumFractionDigits: 0 } in options for rounded figures ("$223").
 */
export function formatCurrency(
  { amount, currency }: Money,
  locale?: string,
  options?: Intl.NumberFormatOptions,
) {
  const value = amount / 10 ** currencyDecimals(currency);
  return currencyFormatter(currency, locale, options).format(value);
}

/** Converts money between currencies. Returns null if a rate is missing. */
export function convertCurrency(
  money: Money,
  to: string,
  rates: ExchangeRates,
): Money | null {
  if (money.currency === to) return money;

  const fromRate = rates[money.currency];
  const toRate = rates[to];
  if (fromRate === undefined || toRate === undefined) return null;

  const major = money.amount / 10 ** currencyDecimals(money.currency);
  const converted = (major / fromRate) * toRate;
  return {
    amount: Math.round(converted * 10 ** currencyDecimals(to)),
    currency: to,
  };
}

/** Adds up amounts in one currency. */
export function sumMoney(list: Money[], currency: string): Money {
  return {
    amount: list.reduce((total, money) => total + money.amount, 0),
    currency,
  };
}
