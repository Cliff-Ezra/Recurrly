/**
 * Where screens get their data. These return mock data for now; when there's
 * a backend, only this file changes to fetch it. Screens already handle
 * isLoading, so they won't need to change.
 */
import { mockSubscriptions, mockUser } from "@/data/mock";

export function useSubscriptions() {
  return { subscriptions: mockSubscriptions, isLoading: false };
}

export function useSubscription(id: string) {
  const subscription = mockSubscriptions.find((item) => item.id === id);
  return { subscription, isLoading: false };
}

export function useUser() {
  return { user: mockUser, isLoading: false };
}
