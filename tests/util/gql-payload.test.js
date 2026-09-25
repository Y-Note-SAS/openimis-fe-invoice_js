import { describe, it, expect } from "vitest";
import { parseJsonField } from "../../src/util/gql-payload";

describe("parseJsonField", () => {
  it("returns null for an empty value", () => {
    expect(parseJsonField(null)).toBeNull();
    expect(parseJsonField(undefined)).toBeNull();
    expect(parseJsonField("")).toBeNull();
  });

  it("parses the JSON string graphene sends for a scalar", () => {
    expect(parseJsonField('{"name":"Trésorerie Caisse","code":"CAISSE"}')).toEqual({
      name: "Trésorerie Caisse",
      code: "CAISSE",
    });
  });

  it("returns null for an invalid JSON string", () => {
    expect(parseJsonField("{oops")).toBeNull();
    expect(parseJsonField("not json")).toBeNull();
  });

  it("returns an already parsed object untouched", () => {
    const value = { name: "Caisse" };
    expect(parseJsonField(value)).toBe(value);
  });
});
