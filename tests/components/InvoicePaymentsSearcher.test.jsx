import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { InvoicePaymentsSearcher } from "../../src/components/InvoicePaymentsSearcher";
import { ACTION_TYPE } from "../../src/reducer";

// `paymentDestination` / `party` travel as JSON strings (graphene JSON scalars).
const DESTINATION = JSON.stringify({ name: "Trésorerie Caisse", code: "CAISSE" });
const PARTY = JSON.stringify({ displayName: "Payment Point Manager B", externalReference: "PPM-2" });

const payment = (overrides = {}) => ({
  id: "payment-1",
  codeExt: "PAY-1",
  amountReceived: "10000.00",
  datePayment: "2026-09-24",
  paymentOrigin: "CHEQUE",
  ...overrides,
});

const buildProps = ({ items = [], ledger = true, submittingMutation = false, mutation = {} } = {}) => ({
  intl: {},
  modulesManager: { getRef: () => (ledger ? {} : undefined), getConf: () => undefined },
  rights: [],
  invoice: { id: "invoice-1", code: "INV-1" },
  setConfirmedAction: vi.fn(),
  deletePaymentInvoice: vi.fn(),
  submittingMutation,
  mutation,
  coreConfirm: vi.fn(),
  journalize: vi.fn(),
  confirmed: null,
  fetchPaymentInvoices: vi.fn(),
  fetchingPaymentInvoices: false,
  fetchedPaymentInvoices: true,
  errorPaymentInvoices: null,
  paymentInvoices: items,
  paymentInvoicesPageInfo: {
    totalCount: items.length,
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  paymentInvoicesTotalCount: items.length,
});

const renderSearcher = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <InvoicePaymentsSearcher {...props} />
    </IntlProvider>,
  );

describe("InvoicePaymentsSearcher", () => {
  it("shows the payment destination and the third party read from the JSON scalars", () => {
    renderSearcher(buildProps({ items: [payment({ paymentDestination: DESTINATION, party: PARTY })] }));

    expect(screen.getByText("paymentInvoice.paymentDestination")).toBeInTheDocument();
    expect(screen.getByText("paymentInvoice.party")).toBeInTheDocument();
    expect(screen.getByText("Trésorerie Caisse")).toBeInTheDocument();
    expect(screen.getByText("Payment Point Manager B")).toBeInTheDocument();
  });

  it("falls back to the journal code and the third-party reference", () => {
    renderSearcher(
      buildProps({
        items: [
          payment({
            paymentDestination: JSON.stringify({ code: "CAISSE" }),
            party: JSON.stringify({ externalReference: "PPM-2" }),
          }),
        ],
      }),
    );

    expect(screen.getByText("CAISSE")).toBeInTheDocument();
    expect(screen.getByText("PPM-2")).toBeInTheDocument();
  });

  it("hides the ledger columns when the ledger module is not loaded", () => {
    renderSearcher(buildProps({ ledger: false, items: [payment({ paymentDestination: DESTINATION, party: PARTY })] }));

    expect(screen.queryByText("paymentInvoice.paymentDestination")).not.toBeInTheDocument();
    expect(screen.queryByText("paymentInvoice.party")).not.toBeInTheDocument();
    expect(screen.queryByText("Trésorerie Caisse")).not.toBeInTheDocument();
  });

  it("only declares the sortable columns (the third party and the action column are not)", () => {
    renderSearcher(buildProps({ items: [payment()] }));

    expect(screen.getByTestId("searcher-sorts")).toHaveTextContent(
      "codeExt,datePayment,amountReceived,paymentOrigin,paymentDestination",
    );
  });

  it("hands the finished mutation to the journal and refetches the list", () => {
    const props = buildProps({
      mutation: { actionType: ACTION_TYPE.CREATE_PAYMENT_INVOICE_WITH_DETAIL, clientMutationId: "client-mutation-id" },
    });
    const { rerender } = renderSearcher(props);
    const renderWith = (overrides) =>
      rerender(
        <IntlProvider locale="en" messages={{}}>
          <InvoicePaymentsSearcher {...props} {...overrides} />
        </IntlProvider>,
      );

    renderWith({ submittingMutation: true });
    renderWith({ submittingMutation: false });

    expect(props.journalize).toHaveBeenCalledTimes(1);
    expect(props.journalize).toHaveBeenCalledWith(props.mutation);
    expect(props.fetchPaymentInvoices).toHaveBeenCalled();
  });
});
