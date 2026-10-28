import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SubscriptionIcon } from "@/components/subscription-icon";
import { type AppearanceChoice, setAppearance } from "@/constants/theme";

const appearanceOptions: AppearanceChoice[] = ["dark", "light", "auto"];

export default function Home() {
  const [appearance, setAppearanceChoice] = useState<AppearanceChoice>("auto");

  const chooseAppearance = (choice: AppearanceChoice) => {
    setAppearanceChoice(choice);
    setAppearance(choice);
  };

  return (
    <SafeAreaView className="screen">
      <ScrollView contentContainerClassName="screen-content">
        <View className="home-header">
          <View className="home-user">
            <Text className="home-date">Sunday, 19 April</Text>
            <Text className="home-user-name">Good morning, Ezra</Text>
          </View>
          <View className="home-user">
            <Link href="/onboarding">Go to Onboarding</Link>
            <Link href="/(auth)/sign-in">Go to Sign In</Link>
            <Link href="/(auth)/sign-up">Go to Sign Up</Link>
          </View>

          <View className="home-user">
            <Link href="/subscriptions/spotify">Spotify Subscription</Link>
            <Link
              href={{
                pathname: "/(tabs)/subscriptions/[id]",
                params: { id: "claude" },
              }}
            >
              Claude Max Subscription
            </Link>
          </View>
        </View>

        <View className="home-balance-card">
          <View className="home-balance-copy">
            <Text className="home-balance-label">Spent in April</Text>
            <Text className="home-balance-amount">$198.53</Text>
            <Text className="home-balance-date">
              <Text className="home-budget-left">$61.47 left</Text> of $260
            </Text>
          </View>
        </View>

        <View className="list-head">
          <Text className="list-title">This week</Text>
          <Text className="list-action-text">See all 7</Text>
        </View>

        <View className="upcoming-card">
          <SubscriptionIcon brand="notion" />
          <View className="upcoming-copy">
            <Text className="upcoming-name">Notion</Text>
            <Text className="upcoming-meta">Tue 21 Apr · Team</Text>
          </View>
          <View className="upcoming-price-box">
            <Text className="upcoming-price">$20.00</Text>
            <View className="chip chip-soon">
              <Text className="chip-text chip-soon-text">In 2 days</Text>
            </View>
          </View>
        </View>

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
