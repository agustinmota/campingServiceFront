import { afterEach, describe, expect, it, vi } from "vitest";
import { confirmDelete } from "./confirmDelete";

describe("confirmDelete", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a delete confirmation message", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    expect(confirmDelete("booking")).toBe(true);
    expect(confirmSpy).toHaveBeenCalledWith("Are you sure you want to delete this booking? This action cannot be undone.");
  });
});
