import { describe, it, expect } from "vitest";
import { ledgerUuid } from "../../src/util/ledger-uuid";

const UUID = "01a0ab26-c294-7a98-b868-f64b425a7f90";

describe("ledgerUuid", () => {
  it("decodes a relay global id", () => {
    expect(ledgerUuid({ id: btoa(`LedgerJournal:${UUID}`) })).toBe(UUID);
  });

  it("keeps an already decoded uuid", () => {
    // The ledger reducers decode relay ids on ingest, so `id` is often the uuid.
    expect(ledgerUuid({ id: UUID })).toBe(UUID);
  });

  it("falls back to analyticValueId", () => {
    expect(ledgerUuid({ analyticValueId: btoa(`AnalyticValue:${UUID}`) })).toBe(UUID);
  });

  it("rejects a value that is not a uuid (backend would answer 'badly formed uuid')", () => {
    expect(ledgerUuid({ id: "CAISSE" })).toBeNull();
    expect(ledgerUuid({ id: "not-a-uuid" })).toBeNull();
    expect(ledgerUuid({ id: "123" })).toBeNull();
  });

  it("returns null for an empty node", () => {
    expect(ledgerUuid(null)).toBeNull();
    expect(ledgerUuid(undefined)).toBeNull();
    expect(ledgerUuid({})).toBeNull();
    expect(ledgerUuid({ id: "" })).toBeNull();
  });
});
