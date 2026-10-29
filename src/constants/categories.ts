import type { CategoryId } from "@/lib/types";

/**
 * Spending categories on Insights. `chart` indexes the theme's chart colours
 * (colors.chart), in the design's order: blue, orange, yellow, teal.
 */
export const categories: Record<CategoryId, { label: string; chart: number }> = {
  work: { label: "Work tools", chart: 0 },
  entertainment: { label: "Entertainment", chart: 1 },
  creative: { label: "Creative", chart: 2 },
  storage: { label: "Storage", chart: 3 },
};
