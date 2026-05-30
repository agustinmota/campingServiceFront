import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currencyUtils";

describe("currencyUtils", () => {
  it("formats values with an explicit USD prefix", () => {
    expect(formatCurrency(100)).toBe("USD 100");
    expect(formatCurrency("1450.5")).toBe("USD 1,450.5");
  });
});
