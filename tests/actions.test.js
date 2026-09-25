import { beforeEach, describe, expect, it, vi } from "vitest";

import { graphql } from "@openimis/fe-core";
import { ACTION_TYPE } from "../src/reducer";
import {
  fetchDetailPaymentInvoices,
  fetchFamilyInvoicePaymentGlobals,
  fetchFamilyInvoicePaymentOverview,
} from "../src/actions";

describe("family invoice-payment actions", () => {
  beforeEach(() => {
    graphql.mockClear();
  });

  it("queries the family overview with the pagination params", () => {
    fetchFamilyInvoicePaymentOverview(['headInsureeId: "head-1"', "first: 5"]);

    const [payload, actionType] = graphql.mock.calls.at(-1);
    expect(actionType).toBe(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_OVERVIEW);
    expect(payload).toContain('familyInvoicePaymentOverview(headInsureeId: "head-1",first: 5)');
    expect(payload).toContain("invoiceBalance");
    expect(payload).toContain("hasInvoicePayments");
  });

  it("forwards the params key of the overview query", () => {
    fetchFamilyInvoicePaymentOverview(['headInsureeId: "head-1"'], { paramsKey: 'headInsureeId: "head-1"' });

    const [, , meta] = graphql.mock.calls.at(-1);
    expect(meta).toEqual({ paramsKey: 'headInsureeId: "head-1"' });
  });

  it("queries the family overview without params when none is given", () => {
    fetchFamilyInvoicePaymentOverview([]);

    const [payload] = graphql.mock.calls.at(-1);
    expect(payload).toContain("familyInvoicePaymentOverview {");
  });

  it("queries the family globals with the family params and the params key", () => {
    fetchFamilyInvoicePaymentGlobals(['headInsureeId: "head-1"'], { paramsKey: "params-key" });

    const [payload, actionType, meta] = graphql.mock.calls.at(-1);
    expect(actionType).toBe(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_GLOBALS);
    expect(payload).toContain('familyInvoicePaymentGlobals(headInsureeId: "head-1")');
    expect(payload).toContain("totalInvoiceAmount");
    expect(payload).toContain("globalBalance");
    expect(meta).toEqual({ paramsKey: "params-key" });
  });

  it("defaults the detail payments query to the detail action type", () => {
    fetchDetailPaymentInvoices(['subjectId: "invoice-1"']);

    const [payload, actionType, meta] = graphql.mock.calls.at(-1);
    expect(actionType).toBe(ACTION_TYPE.SEARCH_DETAIL_PAYMENT_INVOICE);
    expect(meta).toEqual({});
    expect(payload).toContain("detailPaymentInvoice");
  });

  it("carries the invoice id of the detail payments query", () => {
    fetchDetailPaymentInvoices(['subjectId: "invoice-1"'], ACTION_TYPE.SEARCH_INVOICE_PAYMENTS_OVERVIEW, {
      invoiceId: "invoice-1",
    });

    const [, actionType, meta] = graphql.mock.calls.at(-1);
    expect(actionType).toBe(ACTION_TYPE.SEARCH_INVOICE_PAYMENTS_OVERVIEW);
    expect(meta).toEqual({ invoiceId: "invoice-1" });
  });
});

describe("detail payments projection", () => {
  it("requests the payment fields displayed by the expanded invoice row", () => {
    fetchDetailPaymentInvoices(['subjectId: "invoice-1"']);

    const [payload] = graphql.mock.calls.at(-1);
    expect(payload).toContain(
      "payment{ id codeExt codeTp codeReceipt datePayment paymentOrigin payerRef amountReceived }",
    );
  });
});
