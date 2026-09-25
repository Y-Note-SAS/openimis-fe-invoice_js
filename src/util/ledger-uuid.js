/** Well-formed UUID (the backend input fields are `graphene.UUID`). */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The ledger pickers hand out relay global ids (base64 `<TypeName>:<uuid>`),
 * while the invoice payment mutations expect raw UUIDs: `paymentDestinationId`
 * (LedgerJournal) and `partyId` (analytic value). The ledger reducers already
 * decode the relay ids on ingest, so an `id` may also be a plain UUID.
 *
 * Only a **well-formed UUID** is returned; anything else yields `null`, and the
 * caller then omits the field (both inputs are optional) instead of sending a
 * value the backend rejects with "badly formed hexadecimal UUID string".
 */
export const ledgerUuid = (node) => {
  const rawId = node?.id ?? node?.analyticValueId;
  if (!rawId) return null;

  let uuid = String(rawId);
  try {
    const [, decoded] = atob(uuid).split(":");
    if (decoded) uuid = decoded;
  } catch {
    // Not base64: `rawId` is already the raw UUID (relay id decoded upstream).
  }

  return UUID_PATTERN.test(uuid) ? uuid : null;
};

export default ledgerUuid;
