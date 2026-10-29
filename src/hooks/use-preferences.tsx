import { useLocales } from "expo-localization";
import { createContext, type ReactNode, use, useState } from "react";

import { mockMonthlyBudget, mockRates } from "@/data/mock";
import { convertCurrency, formatCurrency } from "@/lib/currency";
import type { Money } from "@/lib/types";

export type Preferences = {
  /** "auto" follows the device's region; otherwise an ISO code like "KES" */
  currency: "auto" | string;
  monthlyBudget: Money;
  renewalReminders: boolean;
  reminderDaysBefore: number;
  weeklySummary: boolean;
};

const defaultPreferences: Preferences = {
  currency: "auto",
  monthlyBudget: mockMonthlyBudget,
  renewalReminders: true,
  reminderDaysBefore: 1,
  weeklySummary: true,
};

type PreferencesContextValue = {
  preferences: Preferences;
  setPreferences: (changes: Partial<Preferences>) => void;
  /** The currency totals are shown in, with "auto" resolved */
  currency: string;
  /** The device's locale, e.g. "en-KE"; decides separators and symbol placement */
  locale: string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

/**
 * Holds the user's settings in memory. The Account screen will call
 * setPreferences; saving them across launches comes later.
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setAll] = useState(defaultPreferences);
  const [deviceLocale] = useLocales();

  // The device's region currency (Kenya → KES), if there's a rate for it
  const deviceCurrency =
    deviceLocale.currencyCode && deviceLocale.currencyCode in mockRates
      ? deviceLocale.currencyCode
      : "USD";

  const value: PreferencesContextValue = {
    preferences,
    setPreferences: (changes) => setAll((current) => ({ ...current, ...changes })),
    currency: preferences.currency === "auto" ? deviceCurrency : preferences.currency,
    locale: deviceLocale.languageTag,
  };

  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}

export function usePreferences() {
  const context = use(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used inside <PreferencesProvider>");
  }
  return context;
}

/**
 * Formatting and conversion in the user's currency and locale:
 *   const { format, formatConverted, convert } = useCurrency();
 *   formatConverted(subscription.price) // "≈ Ksh 2,580.00" for a KES user
 *   format(subscription.price)          // "$20.00", the price as billed
 *   format(convert(subscription.price)) // in the user's currency, no "≈"
 */
export function useCurrency() {
  const { currency, locale } = usePreferences();

  const convert = (money: Money): Money => {
    const converted = convertCurrency(money, currency, mockRates);
    if (converted) return converted;
    if (__DEV__) console.warn(`No exchange rate for ${money.currency}`);
    return { amount: 0, currency };
  };

  const format = (money: Money, options?: Intl.NumberFormatOptions) =>
    formatCurrency(money, locale, options);

  /**
   * In the user's currency. Converted amounts start with "≈": the exchange
   * rate is an estimate, so the bank's charge will differ slightly.
   */
  const formatConverted = (money: Money, options?: Intl.NumberFormatOptions) =>
    money.currency === currency
      ? format(money, options)
      : `≈ ${format(convert(money), options)}`;

  return { currency, locale, convert, format, formatConverted };
}
