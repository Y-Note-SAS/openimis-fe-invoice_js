/**
 * `PaymentInvoiceGQLType` exposes `paymentDestination` (journal) and `party`
 * (third party) as JSON scalars: graphene serializes the resolved object with
 * `json.dumps`, so the GraphQL response carries a JSON *string*
 * (`'{"name":"CAISSE", ...}'`) rather than an object. Parse it before reading
 * any key; an already-parsed object is returned untouched.
 */
export const parseJsonField = (value) => {
  if (!value) return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export default parseJsonField;
