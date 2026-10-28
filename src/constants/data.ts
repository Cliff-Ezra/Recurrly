import type { IconName } from "@/constants/icons";

export type Tab = {
  /** Route file inside src/app/(tabs) */
  name: string;
  title: string;
  icon: IconName;
};

export const tabs: Tab[] = [
  { name: "index", title: "Home", icon: "home" },
  { name: "subscriptions", title: "Plans", icon: "plans" },
  { name: "insights", title: "Insights", icon: "insights" },
  { name: "settings", title: "Account", icon: "account" },
];
