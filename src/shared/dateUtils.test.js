import { describe, expect, it } from "vitest";
import { getDateKey, isSameDay, isSameMonth, normalizeDate } from "./dateUtils";

describe("dateUtils", () => {
  it("formats date keys consistently", () => {
    expect(getDateKey(new Date(2026, 5, 1))).toBe("2026-06-01");
    expect(getDateKey("2026-06-03")).toBe("2026-06-03");
    expect(getDateKey()).toBe("");
  });

  it("normalizes dates to the start of the day", () => {
    const normalized = normalizeDate("2026-06-01T18:30:00");

    expect(normalized.getHours()).toBe(0);
    expect(normalized.getMinutes()).toBe(0);
    expect(normalized.getSeconds()).toBe(0);
  });

  it("compares days and months", () => {
    expect(isSameDay("2026-06-01T10:00:00", "2026-06-01T22:00:00")).toBe(true);
    expect(isSameDay("2026-06-01", "2026-06-02")).toBe(false);
    expect(isSameMonth(new Date(2026, 5, 15), new Date(2026, 5, 1))).toBe(true);
    expect(isSameMonth(new Date(2026, 6, 1), new Date(2026, 5, 1))).toBe(false);
  });
});
