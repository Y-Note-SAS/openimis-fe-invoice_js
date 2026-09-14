import { describe, expect, it } from "vitest";

import reducer, { ACTION_TYPE } from "../src/reducer";

const initialState = reducer(undefined, { type: "@@INIT" });

const request = (type, extra = {}) => ({ type: `${type}_REQ`, ...extra });
const success = (type, payload, extra = {}) => ({ type: `${type}_RESP`, payload, ...extra });
const failure = (type, payload = { message: "boom" }, extra = {}) => ({ type: `${type}_ERR`, payload, ...extra });

describe("family invoice-payment overview", () => {
  const type = ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_OVERVIEW;

  it("flags the overview as fetching and clears the previous page on request", () => {
    const state = reducer(
      {
        ...initialState,
        familyInvoicePaymentOverviewItems: [{ invoiceId: "old" }],
        familyInvoicePaymentOverviewTotalCount: 3,
        fetchedFamilyInvoicePaymentOverview: true,
      },
      request(type),
    );

    expect(state.fetchingFamilyInvoicePaymentOverview).toBe(true);
    expect(state.fetchedFamilyInvoicePaymentOverview).toBe(false);
    expect(state.errorFamilyInvoicePaymentOverview).toBeNull();
    expect(state.familyInvoicePaymentOverviewItems).toEqual([]);
    expect(state.familyInvoicePaymentOverviewTotalCount).toBe(0);
  });

  it("stores the overview page returned by the backend", () => {
    const state = reducer(
      initialState,
      success(type, {
        data: {
          familyInvoicePaymentOverview: {
            totalCount: 2,
            pageInfo: { hasNextPage: false },
            items: [{ invoiceId: "invoice-1" }],
          },
        },
      }),
    );

    expect(state.fetchingFamilyInvoicePaymentOverview).toBe(false);
    expect(state.fetchedFamilyInvoicePaymentOverview).toBe(true);
    expect(state.familyInvoicePaymentOverviewItems).toEqual([{ invoiceId: "invoice-1" }]);
    expect(state.familyInvoicePaymentOverviewPageInfo).toEqual({ hasNextPage: false });
    expect(state.familyInvoicePaymentOverviewTotalCount).toBe(2);
  });

  it("falls back to empty values when the overview payload has no data", () => {
    const state = reducer(initialState, success(type, {}));

    expect(state.familyInvoicePaymentOverviewItems).toEqual([]);
    expect(state.familyInvoicePaymentOverviewPageInfo).toEqual({});
    expect(state.familyInvoicePaymentOverviewTotalCount).toBe(0);
  });

  it("stores the overview error", () => {
    const state = reducer(initialState, failure(type));

    expect(state.fetchingFamilyInvoicePaymentOverview).toBe(false);
    expect(state.errorFamilyInvoicePaymentOverview).toEqual({ message: "boom" });
  });
});

describe("family invoice-payment globals", () => {
  const type = ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_GLOBALS;

  it("keeps the params key of the request so the panel can dedupe", () => {
    const state = reducer(initialState, request(type, { meta: { paramsKey: "key-1" } }));

    expect(state.fetchingFamilyInvoicePaymentGlobals).toBe(true);
    expect(state.familyInvoicePaymentGlobalsParamsKey).toBe("key-1");
  });

  it("defaults the params key to null when the request carries no meta", () => {
    const state = reducer(initialState, request(type));

    expect(state.familyInvoicePaymentGlobalsParamsKey).toBeNull();
  });

  it("stores the globals returned by the backend", () => {
    const state = reducer(
      initialState,
      success(type, {
        data: { familyInvoicePaymentGlobals: { totalInvoiceAmount: 150, totalPaidAmount: 91.5, globalBalance: 58.5 } },
      }),
    );

    expect(state.totalInvoiceAmount).toBe(150);
    expect(state.totalPaidAmount).toBe(91.5);
    expect(state.globalBalance).toBe(58.5);
    expect(state.fetchedFamilyInvoicePaymentGlobals).toBe(true);
  });

  it("defaults the globals to zero when the payload has no data", () => {
    const state = reducer(initialState, success(type, {}));

    expect(state.totalInvoiceAmount).toBe(0);
    expect(state.totalPaidAmount).toBe(0);
    expect(state.globalBalance).toBe(0);
  });
});

describe("invoice payments of an expanded row", () => {
  const type = ACTION_TYPE.SEARCH_INVOICE_PAYMENTS_OVERVIEW;

  it("ignores a request without invoice id", () => {
    const state = reducer(initialState, request(type));

    expect(state).toBe(initialState);
  });

  it("ignores a success without invoice id", () => {
    const state = reducer(initialState, success(type, { data: { detailPaymentInvoice: { edges: [] } } }));

    expect(state).toBe(initialState);
  });

  it("flags the invoice as fetching", () => {
    const state = reducer(initialState, request(type, { meta: { invoiceId: "invoice-1" } }));

    expect(state.isFetchingInvoicePaymentsByInvoiceId).toEqual({ "invoice-1": true });
    expect(state.errorInvoicePaymentsByInvoiceId).toEqual({ "invoice-1": null });
  });

  it("stores the payments of the invoice keyed by invoice id", () => {
    const state = reducer(
      initialState,
      success(
        type,
        { data: { detailPaymentInvoice: { edges: [{ node: { id: "p1" } }] } } },
        {
          meta: { invoiceId: "invoice-1" },
        },
      ),
    );

    expect(state.invoicePaymentsByInvoiceId["invoice-1"]).toEqual([{ id: "p1" }]);
    expect(state.isFetchingInvoicePaymentsByInvoiceId["invoice-1"]).toBe(false);
  });

  it("stores the error of the invoice keyed by invoice id", () => {
    const state = reducer(initialState, failure(type, { message: "boom" }, { meta: { invoiceId: "invoice-2" } }));

    expect(state.errorInvoicePaymentsByInvoiceId["invoice-2"]).toEqual({ message: "boom" });
    expect(state.isFetchingInvoicePaymentsByInvoiceId["invoice-2"]).toBe(false);
  });
});
