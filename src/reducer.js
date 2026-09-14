import {
  formatServerError,
  formatGraphQLError,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
  parseData,
  pageInfo,
  decodeId,
} from "@openimis/fe-core";
import { REQUEST, SUCCESS, ERROR } from "./util/action-type";
import { getEnumValue } from "./util/enum";

export const ACTION_TYPE = {
  MUTATION: "INVOICE_MUTATION",
  SEARCH_INVOICES: "INVOICE_INVOICES",
  GET_INVOICE: "INVOICE_INVOICE",
  DELETE_INVOICE: "INVOICE_DELETE_INVOICE",
  SEARCH_INVOICE_LINE_ITEMS: "INVOICE_INVOICE_LINE_ITEMS",
  SEARCH_INVOICE_PAYMENTS: "INVOICE_INVOICE_PAYMENTS",
  CREATE_INVOICE_PAYMENT: "INVOICE_CREATE_INVOICE_PAYMENT",
  UPDATE_INVOICE_PAYMENT: "INVOICE_UPDATE_INVOICE_PAYMENT",
  DELETE_INVOICE_PAYMENT: "INVOICE_DELETE_INVOICE_PAYMENT",
  SEARCH_INVOICE_EVENTS: "INVOICE_INVOICE_EVENTS",
  CREATE_INVOICE_EVENT_MESSAGE: "INVOICE_CREATE_INVOICE_EVENT_MESSAGE",
  SEARCH_BILLS: "SEARCH_BILLS",
  BILL_EXPORT: "EXPORT BILLS",
  GET_BILL: "BILL_BILL",
  DELETE_BILL: "BILL_DELETE_BILL",
  SEARCH_BILL_LINE_ITEMS: "BILL_BILL_LINE_ITEMS",
  SEARCH_BILL_PAYMENT: "BILL_BILL_PAYMENTS",
  CREATE_BILL_PAYMENT: "BILL_CREATE_BILL_PAYMENT",
  UPDATE_BILL_PAYMENT: "BILL_UPDATE_BILL_PAYMENT",
  DELETE_BILL_PAYMENT: "BILL_DELETE_BILL_PAYMENT",
  SEARCH_BILL_EVENTS: "BILL_BILL_EVENTS",
  CREATE_BILL_EVENT_MESSAGE: "BILL_CREATE_BILL_EVENT_MESSAGE",
  SEARCH_PAYMENT_INVOICE: "PAYMENTINVOICE__PAYMENT_INVOICE",
  SEARCH_DETAIL_PAYMENT_INVOICE: "PAYMENTINVOICE__DETAIL_PAYMENT_INVOICE",
  SEARCH_FAMILY_INVOICE_PAYMENT_OVERVIEW: "INVOICE_FAMILY_INVOICE_PAYMENT_OVERVIEW",
  SEARCH_FAMILY_INVOICE_PAYMENT_GLOBALS: "INVOICE_FAMILY_INVOICE_PAYMENT_GLOBALS",
  SEARCH_INVOICE_PAYMENTS_OVERVIEW: "INVOICE_PAYMENTS_OVERVIEW",
  CREATE_PAYMENT_INVOICE_WITH_DETAIL: "PAYMENTINVOICE_CREATE_PAYMENT_INVOICE_WITH_DETAIL",
  DELETE_PAYMENT_INVOICE: "PAYMENTINVOICE_DELETE_PAYMENT_INVOICE",
};

function reducer(
  state = {
    submittingMutation: false,
    mutation: {},
    fetchingInvoices: false,
    errorInvoices: null,
    fetchedInvoices: false,
    invoices: [],
    invoicesPageInfo: {},
    invoicesTotalCount: 0,
    fetchingInvoice: false,
    errorInvoice: null,
    fetchedInvoice: false,
    invoice: null,
    fetchingInvoiceLineItems: false,
    errorInvoiceLineItems: null,
    fetchedInvoiceLineItems: false,
    invoiceLineItems: [],
    invoiceLineItemsPageInfo: {},
    invoiceLineItemsTotalCount: 0,
    fetchingInvoicePayments: false,
    errorInvoicePayments: null,
    fetchedInvoicePayments: false,
    invoicePayments: [],
    invoicePaymentsPageInfo: {},
    invoicePaymentsTotalCount: 0,
    fetchingInvoiceEvents: false,
    errorInvoiceEvents: null,
    fetchedInvoiceEvents: false,
    invoiceEvents: [],
    invoiceEventsPageInfo: {},
    invoiceEventsTotalCount: 0,

    fetchingBills: false,
    errorBills: null,
    fetchedBills: false,
    bills: [],
    billsPageInfo: {},
    billsTotalCount: 0,
    fetchingBill: false,
    errorBill: null,
    fetchedBill: false,
    bill: null,
    
    fetchingBillLineItems: false,
    errorBillLineItems: null,
    fetchedBillLineItems: false,
    billLineItems: [],
    billLineItemsPageInfo: {},
    billLineItemsTotalCount: 0,

    fetchingBillPayments: false,
    errorBillPayments: null,
    fetchedBillPayments: false,
    billPayments: [],
    billPaymentsPageInfo: {},
    billPaymentsTotalCount: 0,

    fetchingBillEvents: false,
    errorBillEvents: null,
    fetchedBillEvents: false,
    billEvents: [],
    billEventsPageInfo: {},
    billEventsTotalCount: 0,

    fetchingPaymentInvoices: false,
    errorPaymentInvoices: null,
    fetchedPaymentInvoices: false,
    paymentInvoices: [],
    paymentInvoicesPageInfo: {},
    paymentInvoicesTotalCount: 0,

    fetchingDetailPaymentInvoices: false,
    errorDetailPaymentInvoices: null,
    fetchedDetailPaymentInvoices: false,
    detailPaymentInvoices: [],
    detailPaymentInvoicesPageInfo: {},
    detailPaymentInvoicesTotalCount: 0,
    fetchingFamilyInvoicePaymentOverview: false,
    fetchedFamilyInvoicePaymentOverview: false,
    errorFamilyInvoicePaymentOverview: null,
    familyInvoicePaymentOverviewItems: [],
    familyInvoicePaymentOverviewPageInfo: {},
    familyInvoicePaymentOverviewTotalCount: 0,
    totalInvoiceAmount: 0,
    totalPaidAmount: 0,
    globalBalance: 0,
    fetchingFamilyInvoicePaymentGlobals: false,
    fetchedFamilyInvoicePaymentGlobals: false,
    errorFamilyInvoicePaymentGlobals: null,
    familyInvoicePaymentGlobalsParamsKey: null,
    invoicePaymentsByInvoiceId: {},
    isFetchingInvoicePaymentsByInvoiceId: {},
    errorInvoicePaymentsByInvoiceId: {},

    fetchingBillsExport: true,
    fetchedBillsExport: false,
    billsExport: null,
    billsExportPageInfo: {},
    errorBillsExport: null,
  },
  action,
) {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: true,
        fetchedInvoices: false,
        invoices: [],
        invoicesPageInfo: {},
        invoicesTotalCount: 0,
        errorInvoices: null,
      };
    case REQUEST(ACTION_TYPE.GET_INVOICE):
      return {
        ...state,
        fetchingInvoice: true,
        fetchedInvoice: false,
        invoice: null,
        errorInvoice: null,
      };
    case REQUEST(ACTION_TYPE.SEARCH_INVOICE_LINE_ITEMS):
      return {
        ...state,
        fetchingInvoiceLineItems: true,
        fetchedInvoiceLineItems: false,
        invoiceLineItems: [],
        invoiceLineItemsPageInfo: {},
        invoiceLineItemsTotalCount: 0,
        errorInvoiceLineItems: null,
      };
    case REQUEST(ACTION_TYPE.SEARCH_INVOICE_PAYMENTS):
      return {
        ...state,
        fetchingInvoicePayments: true,
        fetchedInvoicePayments: false,
        invoicePayments: [],
        invoicePaymentsPageInfo: {},
        invoicePaymentsTotalCount: 0,
        errorInvoicePayments: null,
      };
    case REQUEST(ACTION_TYPE.SEARCH_INVOICE_EVENTS):
      return {
        ...state,
        fetchingInvoiceEvents: true,
        fetchedInvoiceEvents: false,
        invoiceEvents: [],
        invoiceEventsPageInfo: {},
        invoiceEventsTotalCount: 0,
        errorInvoiceEvents: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: false,
        fetchedInvoices: true,
        invoices: parseData(action.payload.data.invoice)?.map((invoice) => ({
          ...invoice,
          id: decodeId(invoice.id),
          status: getEnumValue(invoice?.status),
        })),
        invoicesPageInfo: pageInfo(action.payload.data.invoice),
        invoicesTotalCount: !!action.payload.data.invoice ? action.payload.data.invoice.totalCount : null,
        errorInvoices: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.GET_INVOICE):
      return {
        ...state,
        fetchingInvoice: false,
        fetchedInvoice: true,
        invoice: parseData(action.payload.data.invoice).map((invoice) => ({
          ...invoice,
          id: decodeId(invoice.id),
          status: getEnumValue(invoice?.status),
        }))?.[0],
        errorInvoice: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_INVOICE_LINE_ITEMS):
      return {
        ...state,
        fetchingInvoiceLineItems: false,
        fetchedInvoiceLineItems: true,
        invoiceLineItems: parseData(action.payload.data.invoiceLineItem)?.map((invoiceLineItem) => ({
          ...invoiceLineItem,
          id: decodeId(invoiceLineItem.id),
        })),
        invoiceLineItemsPageInfo: pageInfo(action.payload.data.invoiceLineItem),
        invoiceLineItemsTotalCount: action.payload.data.invoiceLineItem?.totalCount,
        errorInvoiceLineItems: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.SEARCH_INVOICE_PAYMENTS):
      return {
        ...state,
        fetchingInvoicePayments: false,
        fetchedInvoicePayments: true,
        invoicePayments: parseData(action.payload.data.invoicePayment)?.map((invoicePayment) => ({
          ...invoicePayment,
          id: decodeId(invoicePayment.id),
          status: getEnumValue(invoicePayment?.status),
        })),
        invoicePaymentsPageInfo: pageInfo(action.payload.data.invoicePayment),
        invoicePaymentsTotalCount: action.payload.data.invoicePayment?.totalCount,
        errorInvoicePayments: formatGraphQLError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.SEARCH_INVOICE_EVENTS):
      return {
        ...state,
        fetchingInvoiceEvents: false,
        fetchedInvoiceEvents: true,
        invoiceEvents: parseData(action.payload.data.invoiceEvent)?.map((invoiceEvent) => ({
          ...invoiceEvent,
          eventType: getEnumValue(invoiceEvent?.eventType),
        })),
        invoiceEventsPageInfo: pageInfo(action.payload.data.invoiceEvent),
        invoiceEventsTotalCount: action.payload.data.invoiceEvent?.totalCount,
        errorInvoiceEvents: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_INVOICES):
      return {
        ...state,
        fetchingInvoices: false,
        errorInvoices: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_INVOICE):
      return {
        ...state,
        fetchingInvoice: false,
        errorInvoice: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_INVOICE_LINE_ITEMS):
      return {
        ...state,
        fetchingInvoiceLineItems: false,
        errorInvoiceLineItems: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_INVOICE_PAYMENTS):
      return {
        ...state,
        fetchingInvoicePayments: false,
        errorInvoicePayments: formatServerError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_INVOICE_EVENTS):
      return {
        ...state,
        fetchingInvoiceEvents: false,
        errorInvoiceEvents: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.SEARCH_BILLS):
      return {
        ...state,
        fetchingBills: true,
        fetchedBills: false,
        bills: [],
        billsPageInfo: {},
        billsTotalCount: 0,
        errorBills: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BILLS):
      return {
        ...state,
        fetchingBills: false,
        fetchedBills: true,
        bills: parseData(action.payload.data.bill)?.map((bill) => ({
          ...bill,
          id: decodeId(bill.id),
          status: getEnumValue(bill?.status)
        })),
        billsPageInfo: pageInfo(action.payload.data.bill),
        billsTotalCount: !!action.payload.data.bill ? action.payload.data.bill.totalCount : null,
        errorBills: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_BILLS):
      return {
        ...state,
        fetchingBills: false,
        errorBills: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.BILL_EXPORT):
        return {
          ...state,
          fetchingBillsExport: true,
          fetchedBillsExport: false,
          billsExport: null,
          billsExportPageInfo: {},
          errorBillsExport: null,
        };
    case SUCCESS(ACTION_TYPE.BILL_EXPORT):
    return {
        ...state,
        fetchingBillsExport: false,
        fetchedBillsExport: true,
        billsExport: action.payload.data.billExport,
        billsExportPageInfo: pageInfo(action.payload.data.billExport),
        errorBillsExport: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.BILL_EXPORT):
      return {
        ...state,
        fetchingBillsExport: false,
        errorBillsExport: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.GET_BILL):
      return {
        ...state,
        fetchingBill: true,
        fetchedBill: false,
        bill: null,
        errorBill: null,
      };
    case SUCCESS(ACTION_TYPE.GET_BILL):
      return {
        ...state,
        fetchingBill: false,
        fetchedBill: true,
        bill: parseData(action.payload.data.bill).map((bill) => ({
          ...bill,
          id: decodeId(bill.id),
          status: getEnumValue(bill?.status),
          subjectTypeNameLabel: (bill?.subjectTypeName)?.replace(/\s/g, ""),
          thirdpartyTypeNameLabel: (bill?.thirdpartyTypeName)?.replace(/\s/g, ""),
        }))?.[0],
        errorBill: null,
      };
    case ERROR(ACTION_TYPE.GET_BILL):
      return {
        ...state,
        fetchingBill: false,
        errorBill: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.SEARCH_BILL_LINE_ITEMS):
      return {
        ...state,
        fetchingBillLineItems: true,
        fetchedBillLineItems: false,
        billLineItems: [],
        billLineItemsPageInfo: {},
        billLineItemsTotalCount: 0,
        errorBillLineItems: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BILL_LINE_ITEMS):
      return {
        ...state,
        fetchingBillLineItems: false,
        fetchedBillLineItems: true,
        billLineItems: parseData(action.payload.data.billItem)?.map((billItem) => ({
          ...billItem,
          id: decodeId(billItem.id),
        })),
        billLineItemsPageInfo: pageInfo(action.payload.data.billItem),
        billLineItemsTotalCount: action.payload.data.billItem?.totalCount,
        errorBillLineItems: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_BILL_LINE_ITEMS):
      return {
        ...state,
        fetchingBillLineItems: false,
        errorBillLineItems: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.SEARCH_BILL_PAYMENT):
      return {
        ...state,
        fetchingBillPayments: true,
        fetchedBillPayments: false,
        billPayments: [],
        billPaymentsPageInfo: {},
        billPaymentsTotalCount: 0,
        errorBillPayments: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BILL_PAYMENT):
      return {
        ...state,
        fetchingBillPayments: false,
        fetchedBillPayments: true,
        billPayments: parseData(action.payload.data.billPayment)?.map((billPayment) => ({
          ...billPayment,
          id: decodeId(billPayment.id),
          status: getEnumValue(billPayment?.status),
        })),
        billPaymentsPageInfo: pageInfo(action.payload.data.billPayment),
        billPaymentsTotalCount: action.payload.data.billPayment?.totalCount,
        errorBillPayments: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_BILL_PAYMENT):
      return {
        ...state,
        fetchingBillPayments: false,
        errorBillPayments: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.SEARCH_BILL_EVENTS):
      return {
        ...state,
        fetchingBillEvents: true,
        fetchedBillEvents: false,
        billEvents: [],
        billEventsPageInfo: {},
        billEventsTotalCount: 0,
        errorBillEvents: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_BILL_EVENTS):
      return {
        ...state,
        fetchingBillEvents: false,
        fetchedBillEvents: true,
        billEvents: parseData(action.payload.data.billEvent)?.map((billEvent) => ({
          ...billEvent,
          eventType: getEnumValue(billEvent?.eventType),
        })),
        billEventsPageInfo: pageInfo(action.payload.data.billEvent),
        billEventsTotalCount: action.payload.data.billEvent?.totalCount,
        errorBillEvents: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_BILL_EVENTS):
      return {
        ...state,
        fetchingBillEvents: false,
        errorBillEvents: formatServerError(action.payload),
      };
    
    case REQUEST(ACTION_TYPE.SEARCH_PAYMENT_INVOICE):
      return {
        ...state,
        fetchingPaymentInvoices: true,
        fetchedPaymentInvoices: false,
        paymentInvoices: [],
        paymentInvoicesPageInfo: {},
        paymentInvoicesTotalCount: 0,
        errorPaymentInvoices: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_PAYMENT_INVOICE):
      return {
        ...state,
        fetchingPaymentInvoices: false,
        fetchedPaymentInvoices: true,
        paymentInvoices: parseData(action.payload.data.paymentInvoice)?.map((paymentInvoice) => ({
          ...paymentInvoice,
          id: decodeId(paymentInvoice.id),
          reconciliationStatus: getEnumValue(paymentInvoice?.reconciliationStatus),
        })),
        paymentInvoicesPageInfo: pageInfo(action.payload.data.paymentInvoice),
        paymentInvoicesTotalCount: action.payload.data.paymentInvoice?.totalCount,
        errorPaymentInvoices: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_PAYMENT_INVOICE):
      return {
        ...state,
        fetchingPaymentInvoices: false,
        errorPaymentInvoices: formatServerError(action.payload),
      };

    case REQUEST(ACTION_TYPE.SEARCH_DETAIL_PAYMENT_INVOICE):
      return {
        ...state,
        fetchingDetailPaymentInvoices: true,
        fetchedDetailPaymentInvoices: false,
        detailPaymentInvoices: [],
        detailPaymentInvoicesPageInfo: {},
        detailPaymentInvoicesTotalCount: 0,
        errorPaymentInvoices: null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_DETAIL_PAYMENT_INVOICE):
      return {
        ...state,
        fetchingDetailPaymentInvoices: false,
        fetchedDetailPaymentInvoices: true,
        detailPaymentInvoices: parseData(action.payload.data.detailPaymentInvoice)?.map((detailPaymentInvoice) => ({
          ...detailPaymentInvoice,
          id: decodeId(detailPaymentInvoice.id),
          reconciliationStatus: getEnumValue(detailPaymentInvoice?.reconciliationStatus),
        })),
        detailPaymentInvoicesPageInfo: pageInfo(action.payload.data.detailPaymentInvoice),
        detailPaymentInvoicesTotalCount: action.payload.data.detailPaymentInvoice?.totalCount,
        errorDetailPaymentInvoices: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.SEARCH_DETAIL_PAYMENT_INVOICE):
      return {
        ...state,
        fetchingDetailPaymentInvoices: false,
        errorDetailPaymentInvoices: formatServerError(action.payload),
      };

    case REQUEST(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_OVERVIEW):
      return {
        ...state,
        fetchingFamilyInvoicePaymentOverview: true,
        fetchedFamilyInvoicePaymentOverview: false,
        errorFamilyInvoicePaymentOverview: null,
        familyInvoicePaymentOverviewItems: [],
        familyInvoicePaymentOverviewPageInfo: {},
        familyInvoicePaymentOverviewTotalCount: 0,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_OVERVIEW):
      return {
        ...state,
        fetchingFamilyInvoicePaymentOverview: false,
        fetchedFamilyInvoicePaymentOverview: true,
        errorFamilyInvoicePaymentOverview: formatGraphQLError(action.payload),
        familyInvoicePaymentOverviewItems:
          action.payload?.data?.familyInvoicePaymentOverview?.items || [],
        familyInvoicePaymentOverviewPageInfo:
          action.payload?.data?.familyInvoicePaymentOverview?.pageInfo || {},
        familyInvoicePaymentOverviewTotalCount:
          action.payload?.data?.familyInvoicePaymentOverview?.totalCount || 0,
      };
    case ERROR(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_OVERVIEW):
      return {
        ...state,
        fetchingFamilyInvoicePaymentOverview: false,
        errorFamilyInvoicePaymentOverview: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_GLOBALS):
      return {
        ...state,
        fetchingFamilyInvoicePaymentGlobals: true,
        fetchedFamilyInvoicePaymentGlobals: false,
        errorFamilyInvoicePaymentGlobals: null,
        familyInvoicePaymentGlobalsParamsKey: action.meta?.paramsKey || null,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_GLOBALS):
      return {
        ...state,
        fetchingFamilyInvoicePaymentGlobals: false,
        fetchedFamilyInvoicePaymentGlobals: true,
        errorFamilyInvoicePaymentGlobals: formatGraphQLError(action.payload),
        totalInvoiceAmount: action.payload?.data?.familyInvoicePaymentGlobals?.totalInvoiceAmount || 0,
        totalPaidAmount: action.payload?.data?.familyInvoicePaymentGlobals?.totalPaidAmount || 0,
        globalBalance: action.payload?.data?.familyInvoicePaymentGlobals?.globalBalance || 0,
      };
    case ERROR(ACTION_TYPE.SEARCH_FAMILY_INVOICE_PAYMENT_GLOBALS):
      return {
        ...state,
        fetchingFamilyInvoicePaymentGlobals: false,
        errorFamilyInvoicePaymentGlobals: formatServerError(action.payload),
      };
    case REQUEST(ACTION_TYPE.SEARCH_INVOICE_PAYMENTS_OVERVIEW): {
      const invoiceId = action.meta?.invoiceId || action.invoiceId;
      if (!invoiceId) return state;
      return {
        ...state,
        isFetchingInvoicePaymentsByInvoiceId: {
          ...state.isFetchingInvoicePaymentsByInvoiceId,
          [invoiceId]: true,
        },
        errorInvoicePaymentsByInvoiceId: {
          ...state.errorInvoicePaymentsByInvoiceId,
          [invoiceId]: null,
        },
      };
    }
    case SUCCESS(ACTION_TYPE.SEARCH_INVOICE_PAYMENTS_OVERVIEW): {
      const invoiceId = action.meta?.invoiceId || action.invoiceId;
      if (!invoiceId) return state;
      return {
        ...state,
        invoicePaymentsByInvoiceId: {
          ...state.invoicePaymentsByInvoiceId,
          [invoiceId]: parseData(action.payload?.data?.detailPaymentInvoice),
        },
        isFetchingInvoicePaymentsByInvoiceId: {
          ...state.isFetchingInvoicePaymentsByInvoiceId,
          [invoiceId]: false,
        },
        errorInvoicePaymentsByInvoiceId: {
          ...state.errorInvoicePaymentsByInvoiceId,
          [invoiceId]: formatGraphQLError(action.payload),
        },
      };
    }
    case ERROR(ACTION_TYPE.SEARCH_INVOICE_PAYMENTS_OVERVIEW): {
      const invoiceId = action.meta?.invoiceId || action.invoiceId;
      if (!invoiceId) return state;
      return {
        ...state,
        isFetchingInvoicePaymentsByInvoiceId: {
          ...state.isFetchingInvoicePaymentsByInvoiceId,
          [invoiceId]: false,
        },
        errorInvoicePaymentsByInvoiceId: {
          ...state.errorInvoicePaymentsByInvoiceId,
          [invoiceId]: formatServerError(action.payload),
        },
      };
    }

    case REQUEST(ACTION_TYPE.MUTATION):
      return dispatchMutationReq(state, action);
    case ERROR(ACTION_TYPE.MUTATION):
      return dispatchMutationErr(state, action);
    case SUCCESS(ACTION_TYPE.DELETE_INVOICE):
      return dispatchMutationResp(state, "deleteInvoice", action);
    case SUCCESS(ACTION_TYPE.CREATE_INVOICE_PAYMENT):
      return dispatchMutationResp(state, "createInvoicePayment", action);
    case SUCCESS(ACTION_TYPE.UPDATE_INVOICE_PAYMENT):
      return dispatchMutationResp(state, "updateInvoicePayment", action);
    case SUCCESS(ACTION_TYPE.DELETE_INVOICE_PAYMENT):
      return dispatchMutationResp(state, "deleteInvoicePayment", action);
    case SUCCESS(ACTION_TYPE.CREATE_INVOICE_EVENT_MESSAGE):
      return dispatchMutationResp(state, "createInvoiceEventMessage", action);
    case SUCCESS(ACTION_TYPE.DELETE_BILL):
      return dispatchMutationResp(state, "deleteBill", action);
    case SUCCESS(ACTION_TYPE.CREATE_BILL_PAYMENT):
      return dispatchMutationResp(state, "createBillPayment", action);
    case SUCCESS(ACTION_TYPE.UPDATE_BILL_PAYMENT):
      return dispatchMutationResp(state, "updateBillPayment", action);
    case SUCCESS(ACTION_TYPE.DELETE_BILL_PAYMENT):
      return dispatchMutationResp(state, "deleteBillPayment", action);
    case SUCCESS(ACTION_TYPE.CREATE_BILL_EVENT_MESSAGE):
      return dispatchMutationResp(state, "createBillEventType", action);
    case SUCCESS(ACTION_TYPE.CREATE_PAYMENT_INVOICE_WITH_DETAIL):
      return dispatchMutationResp(state, "createPaymentWithDetailInvoice", action);
    case SUCCESS(ACTION_TYPE.DELETE_PAYMENT_INVOICE):
      return dispatchMutationResp(state, "deletePaymentInvoice", action);
    default:
      return state;
  }
}

export default reducer;
