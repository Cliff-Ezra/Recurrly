import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SubscriptionIcon } from "@/components/subscription-icon";
import { type AppearanceChoice, setAppearance } from "@/constants/theme";
import { useNow } from "@/hooks/use-now";
import { useCurrency, usePreferences } from "@/hooks/use-preferences";
import { useSubscriptions, useUser } from "@/hooks/use-subscriptions";
import {
  dueLabel,
  formatLongDate,
  formatShortDate,
  greeting,
} from "@/lib/dates";
import {
  chargesBetween,
  chargesTotal,
  upcomingRenewals,
} from "@/lib/subscriptions";

const appearanceOptions: AppearanceChoice[] = ["dark", "light", "auto"];

export default function Home() {
  const [appearance, setAppearanceChoice] = useState<AppearanceChoice>("auto");
  const now = useNow();
  const { user } = useUser();
  const { subscriptions } = useSubscriptions();
  const { preferences } = usePreferences();
  const { currency, convert, format, formatConverted } = useCurrency();

  const spent = chargesTotal(
    chargesBetween(subscriptions, now.startOf("month"), now),
    convert,
    currency,
  );
  const budget = convert(preferences.monthlyBudget);
  const left = { amount: budget.amount - spent.amount, currency };
  const thisWeek = upcomingRenewals(subscriptions, now).filter(
    (renewal) => renewal.days <= 7,
  );

  const chooseAppearance = (choice: AppearanceChoice) => {
    setAppearanceChoice(choice);
    setAppearance(choice);
  };

  return (
    <SafeAreaView className="screen">
      <ScrollView contentContainerClassName="screen-content">
        <View className="home-header">
          <View className="home-user">
            <Text className="home-date">{formatLongDate(now)}</Text>
            <Text className="home-user-name">
              {greeting(now)}, {user.name}
            </Text>
          </View>
        </View>

        <View className="home-balance-card">
          <View className="home-balance-copy">
            <Text className="home-balance-label">
              Spent in {now.format("MMMM")}
            </Text>
            <Text className="home-balance-amount">{format(spent)}</Text>
            <Text className="home-balance-date">
              {left.amount >= 0 ? (
                <Text className="home-budget-left">{format(left)} left</Text>
              ) : (
                <Text className="home-budget-over">
                  {format({ ...left, amount: -left.amount })} over
                </Text>
              )}{" "}
              of {format(budget, { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </View>

        <View className="list-head">
          <Text className="list-title">This week</Text>
          <Text className="list-action-text">See all {thisWeek.length}</Text>
        </View>

        {thisWeek.slice(0, 3).map(({ subscription, date, days }) => (
          <View key={subscription.id} className="upcoming-card">
            <SubscriptionIcon
              brand={subscription.brand}
              name={subscription.name}
            />
            <View className="upcoming-copy">
              <Text className="upcoming-name">{subscription.name}</Text>
              <Text className="upcoming-meta">
                {formatShortDate(date)} · {subscription.plan}
              </Text>
            </View>
            <View className="upcoming-price-box">
              <Text className="upcoming-price">
                {formatConverted(subscription.price)}
              </Text>
              <View className={days <= 2 ? "chip chip-soon" : "chip"}>
                <Text
                  className={
                    days <= 2 ? "chip-text chip-soon-text" : "chip-text"
                  }
                >
                  {dueLabel(date, now)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <Text className="group-title">Appearance</Text>
        <View className="segmented">
          {appearanceOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => chooseAppearance(option)}
              className={`segmented-option rounded-md ${appearance === option ? "bg-muted-raised" : ""}`}
            >
              <Text className="segmented-text capitalize">{option}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
