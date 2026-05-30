import { describe, expect, it } from "vitest";
import { buildAdminAccommodations, buildPublicAccommodations } from "./accommodationUtils";

describe("accommodationUtils", () => {
  it("maps public cabins and campsites to a shared card shape", () => {
    const accommodations = buildPublicAccommodations({
      cabins: [{ id: 1, identifier: "A", pricePerDay: 1000 }],
      campsites: [{ id: 2, identifier: "P1", pricePerPerson: 350 }]
    });

    expect(accommodations).toEqual([
      expect.objectContaining({ id: 1, type: "cabin", typeLabel: "Cabin", price: 1000, priceLabel: "per day" }),
      expect.objectContaining({ id: 2, type: "campsite", typeLabel: "Campsite", price: 350, priceLabel: "per person" })
    ]);
  });

  it("maps admin accommodations with rate labels", () => {
    const accommodations = buildAdminAccommodations(
      [{ id: 1, identifier: "A", pricePerDay: 1200 }],
      [{ id: 2, identifier: "P2", pricePerPerson: 400 }]
    );

    expect(accommodations).toEqual([
      expect.objectContaining({ type: "Cabin", price: 1200, rateLabel: "per day" }),
      expect.objectContaining({ type: "Campsite", price: 400, rateLabel: "per person" })
    ]);
  });
});
