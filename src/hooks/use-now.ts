import { useEffect, useState } from "react";

import { dayjs } from "@/lib/dates";

/**
 * The current time, refreshed every `intervalMs`. Use 1000 for the renewal
 * countdown; the default minute is enough for dates and "In 2 days".
 */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
