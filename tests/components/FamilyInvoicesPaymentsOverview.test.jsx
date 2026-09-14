import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { historyPush } from "@openimis/fe-core";
import { FamilyInvoicesPaymentsOverview } from "../../src/components/FamilyInvoicesPaymentsOverview";
import { RIGHT_INVOICE_SEARCH } from "../../src/constants";

const intl = { formatMessage: ({ id }) => id };

const buildProps = ({ invoicePaymentMode = true, overrides = {} } = {}) => ({
  modulesManager: {
    getConf: (module, key, defaultValue) =>
      module === "fe-policy" && key === "enableInvoicePaymentMode" ? invoicePaymentMode : defaultValue,
  },
  intl,
  history: { push: vi.fn() },
  family: { uuid: "family-1", headInsuree: { id: "enc:head-1" } },
  rights: [RIGHT_INVOICE_SEARCH],
  invoiceRows: [],
  invoiceRowsTotalCount: 0,
  isFetchingInvoiceRows: false,
  invoiceRowsError: null,
  totalInvoiceAmount: 0,
  totalPaidAmount: 0,
  globalBalance: 0,
  invoicePaymentsByInvoiceId: {},
  isFetchingInvoicePaymentsByInvoiceId: {},
  errorInvoicePaymentsByInvoiceId: {},
  familyInvoicePaymentGlobalsParamsKey: null,
  fetch: vi.fn(),
  fetchFamilyInvoicePaymentGlobals: vi.fn(),
  fetchInvoicePaymentsDetails: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

const renderPanel = (props) => {
  const ref = React.createRef();
  const utils = render(
    <IntlProvider locale="en" messages={{}}>
      <FamilyInvoicesPaymentsOverview ref={ref} {...props} />
    </IntlProvider>,
  );
  return { ...utils, panel: ref };
};

describe("FamilyInvoicesPaymentsOverview rendering", () => {
  beforeEach(() => {
    historyPush.mockClear();
  });

  it("renders nothing when the invoice payment mode is disabled", () => {
    const { container } = renderPanel(buildProps({ invoicePaymentMode: false }));

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing without a family head insuree", () => {
    const { container } = renderPanel(buildProps({ overrides: { family: { uuid: "family-1" } } }));

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing without the invoice search right", () => {
    const { container } = renderPanel(buildProps({ overrides: { rights: [] } }));

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the totals and the family invoices", () => {
    renderPanel(
      buildProps({
        overrides: {
          invoiceRowsTotalCount: 1,
          totalInvoiceAmount: 100,
          totalPaidAmount: 40,
          globalBalance: 60,
          invoiceRows: [
            {
              invoiceId: "invoice-1",
              invoiceCode: "INV-1",
              coveredFrom: "2026-01-01",
              coveredTo: "2026-12-31",
              amountDue: 100,
              totalInvoicePayments: 40,
              invoiceBalance: 60,
              lastPayment: "2026-06-01",
            },
          ],
        },
      }),
    );

    expect(screen.getByText("familyInvoicesPayments.title")).toBeInTheDocument();
    expect(screen.getByText("familyInvoicesPayments.totalInvoiceAmount: 100")).toBeInTheDocument();
    expect(screen.getByText("familyInvoicesPayments.totalPaidAmount: 40")).toBeInTheDocument();
    expect(screen.getByText("familyInvoicesPayments.globalBalance: 60")).toBeInTheDocument();
    expect(screen.getByText("INV-1")).toBeInTheDocument();
    expect(screen.getByText("2026-01-01 - 2026-12-31")).toBeInTheDocument();
  });

  it("shows a loader instead of the table while the invoices are fetching", () => {
    renderPanel(buildProps({ overrides: { isFetchingInvoiceRows: true, invoiceRows: [{ invoiceId: "invoice-1" }] } }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(document.querySelector("table")).not.toBeInTheDocument();
  });

  it("renders the table error when the overview query failed", () => {
    renderPanel(buildProps({ overrides: { invoiceRowsError: { message: "boom" } } }));

    expect(screen.getByRole("alert")).toHaveTextContent("boom");
  });
});

describe("FamilyInvoicesPaymentsOverview globals", () => {
  it("requests the family globals on mount", () => {
    const props = buildProps();

    renderPanel(props);

    expect(props.fetchFamilyInvoicePaymentGlobals).toHaveBeenCalledWith(
      ['headInsureeId: "head-1"'],
      'headInsureeId: "head-1"',
    );
  });

  it("does not request the globals without a head insuree", () => {
    const props = buildProps({ overrides: { family: { uuid: "family-1" } } });

    renderPanel(props);

    expect(props.fetchFamilyInvoicePaymentGlobals).not.toHaveBeenCalled();
  });

  it("does not request the globals again when the family and the stored params key did not change", () => {
    const props = buildProps({
      overrides: { familyInvoicePaymentGlobalsParamsKey: 'headInsureeId: "head-1"' },
    });
    const { panel } = renderPanel(props);
    props.fetchFamilyInvoicePaymentGlobals.mockClear();

    panel.current.fetchGlobalsIfNeeded({ family: props.family });

    expect(props.fetchFamilyInvoicePaymentGlobals).not.toHaveBeenCalled();
  });

  it("requests the globals again when the family changed", () => {
    const props = buildProps({
      overrides: { familyInvoicePaymentGlobalsParamsKey: 'headInsureeId: "head-1"' },
    });
    const { panel } = renderPanel(props);
    props.fetchFamilyInvoicePaymentGlobals.mockClear();

    panel.current.fetchGlobalsIfNeeded({ family: { headInsuree: { id: "enc:other-head" } } });

    expect(props.fetchFamilyInvoicePaymentGlobals).toHaveBeenCalledWith(
      ['headInsureeId: "head-1"'],
      'headInsureeId: "head-1"',
    );
  });
});

describe("FamilyInvoicesPaymentsOverview expanded invoice", () => {
  const invoiceRow = { invoiceId: "invoice-1", invoiceCode: "INV-1" };

  it("expands the selected invoice and fetches its payments", async () => {
    const props = buildProps({ overrides: { invoiceRows: [invoiceRow] } });
    const { panel } = renderPanel(props);

    await act(async () => {
      await panel.current.onToggleInvoiceDetails([invoiceRow]);
    });

    expect(props.fetchInvoicePaymentsDetails).toHaveBeenCalledWith("invoice-1", [
      'subjectType: "invoice"',
      'subjectId: "invoice-1"',
      "isDeleted: false",
      "payment_IsDeleted: false",
    ]);
    expect(panel.current.state.expandedInvoiceId).toBe("invoice-1");
  });

  it("reuses the cached payments of an already fetched invoice", async () => {
    const props = buildProps({
      overrides: {
        invoiceRows: [invoiceRow],
        invoicePaymentsByInvoiceId: { "invoice-1": [{ id: "payment-1" }] },
      },
    });
    const { panel } = renderPanel(props);

    await act(async () => {
      await panel.current.onToggleInvoiceDetails([invoiceRow]);
    });

    expect(props.fetchInvoicePaymentsDetails).not.toHaveBeenCalled();
  });

  it("collapses the invoice when it is selected again", async () => {
    const props = buildProps({ overrides: { invoiceRows: [invoiceRow] } });
    const { panel } = renderPanel(props);

    await act(async () => {
      await panel.current.onToggleInvoiceDetails([invoiceRow]);
    });
    await act(async () => {
      await panel.current.onToggleInvoiceDetails([invoiceRow]);
    });

    expect(panel.current.state.expandedInvoiceId).toBeNull();
  });

  it("collapses the expanded invoice when the selection is cleared", async () => {
    const props = buildProps({ overrides: { invoiceRows: [invoiceRow] } });
    const { panel } = renderPanel(props);

    await act(async () => {
      await panel.current.onToggleInvoiceDetails([invoiceRow]);
    });
    await act(async () => {
      await panel.current.onToggleInvoiceDetails([]);
    });

    expect(panel.current.state.expandedInvoiceId).toBeNull();
  });

  it("renders the payments of the expanded invoice", async () => {
    const props = buildProps({
      overrides: {
        invoiceRows: [invoiceRow],
        invoicePaymentsByInvoiceId: {
          "invoice-1": [
            {
              amount: 40,
              payment: {
                datePayment: "2026-06-01",
                codeExt: "REF-1",
                paymentOrigin: "cash",
                codeReceipt: "RCPT-1",
                payerRef: "PAYER-1",
              },
            },
          ],
        },
      },
    });
    const { panel } = renderPanel(props);

    await act(async () => {
      await panel.current.onToggleInvoiceDetails([invoiceRow]);
    });

    expect(screen.getByText("familyInvoicesPayments.invoicePaymentsSectionTitle")).toBeInTheDocument();
    expect(screen.getByText("REF-1")).toBeInTheDocument();
    expect(screen.getByText("RCPT-1")).toBeInTheDocument();
    expect(screen.getByText("PAYER-1")).toBeInTheDocument();
  });

  it("does not render the expanded block when no invoice is expanded", () => {
    const props = buildProps({ overrides: { invoiceRows: [invoiceRow] } });
    const { panel } = renderPanel(props);

    expect(panel.current.renderExpandedInvoiceDetails()).toBeNull();
  });
});

describe("FamilyInvoicesPaymentsOverview navigation", () => {
  beforeEach(() => {
    historyPush.mockClear();
  });

  it("opens the invoice on double click", () => {
    const props = buildProps();
    const { panel } = renderPanel(props);

    panel.current.onDoubleClick({ invoiceId: "invoice-1" });

    expect(historyPush).toHaveBeenCalledWith(
      props.modulesManager,
      props.history,
      "invoice.route.invoice",
      ["invoice-1"],
      false,
    );
  });

  it("does not navigate without an invoice id", () => {
    const { panel } = renderPanel(buildProps());

    panel.current.onDoubleClick({});

    expect(historyPush).not.toHaveBeenCalled();
  });
});

describe("FamilyInvoicesPaymentsOverview helpers", () => {
  it("formats the covered period and blanks it out when empty", () => {
    const { panel } = renderPanel(buildProps());

    expect(panel.current.formatCoveredPeriod({ coveredFrom: "2026-01-01", coveredTo: "2026-12-31" })).toBe(
      "2026-01-01 - 2026-12-31",
    );
    expect(panel.current.formatCoveredPeriod({})).toBe("");
    expect(panel.current.formatCoveredPeriod({ coveredFrom: "2026-01-01" })).toBe("2026-01-01 -");
  });

  it("builds the query params from the decoded head insuree id", () => {
    const { panel } = renderPanel(buildProps());

    expect(panel.current.queryPrms()).toEqual(['headInsureeId: "head-1"']);
  });

  it("returns no query params without a head insuree", () => {
    const { panel } = renderPanel(buildProps({ overrides: { family: {} } }));

    expect(panel.current.queryPrms()).toBeNull();
  });
});
