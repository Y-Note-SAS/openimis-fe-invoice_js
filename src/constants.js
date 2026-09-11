export const RIGHT_INVOICE_SEARCH = 155101;
export const RIGHT_INVOICE_CREATE = 155102;
export const RIGHT_INVOICE_UPDATE = 155103;
export const RIGHT_INVOICE_DELETE = 155104;
export const RIGHT_INVOICE_AMEND = 155109;
export const RIGHT_INVOICE_PAYMENT_SEARCH = 155201;
export const RIGHT_INVOICE_PAYMENT_CREATE = 155202;
export const RIGHT_INVOICE_PAYMENT_UPDATE = 155203;
export const RIGHT_INVOICE_PAYMENT_DELETE = 155204;
export const RIGHT_INVOICE_PAYMENT_REFUND = 155206;
export const RIGHT_INVOICE_EVENT_SEARCH = 155301;
export const RIGHT_INVOICE_EVENT_CREATE = 155302;
export const RIGHT_INVOICE_EVENT_UPDATE = 155303;
export const RIGHT_INVOICE_EVENT_DELETE = 155304;
export const RIGHT_INVOICE_EVENT_CREATE_MESSAGE = 155306;
export const RIGHT_INVOICE_EVENT_DELETE_MY_MESSAGE = 155307;
export const RIGHT_INVOICE_EVENT_DELETE_ALL_MESSAGE = 155308;
export const RIGHT_BILL_SEARCH = 156101;
export const RIGHT_BILL_CREATE = 156102;
export const RIGHT_BILL_UPDATE = 156103;
export const RIGHT_BILL_DELETE = 156104;
export const RIGHT_BILL_AMEND = 156109;
export const RIGHT_BILL_PAYMENT_SEARCH = 156201;
export const RIGHT_BILL_PAYMENT_CREATE = 156202;
export const RIGHT_BILL_PAYMENT_UPDATE = 156203;
export const RIGHT_BILL_PAYMENT_DELETE = 156204;
export const RIGHT_BILL_PAYMENT_REFUND = 156206;
export const RIGHT_BILL_EVENT_SEARCH = 156301;
export const RIGHT_BILL_EVENT_CREATE = 156302;
export const RIGHT_BILL_EVENT_UPDATE = 156303;
export const RIGHT_BILL_EVENT_DELETE = 156304;
export const RIGHT_BILL_EVENT_CREATE_MESSAGE = 156306;
export const RIGHT_BILL_EVENT_DELETE_MY_MESSAGE = 156307;
export const RIGHT_BILL_EVENT_DELETE_ALL_MESSAGE = 156308;
export const INSPECTOR_RIGHT = 204005;
export const ADMIN_RIGHT = 204004;
export const DEFAULT_PAGE_SIZE = 10;
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const EMPTY_STRING = "";
export const DATE_TO_DATETIME_SUFFIX = "T00:00:00";
export const GREATER_OR_EQUAL_LOOKUP = "Gte";
export const LESS_OR_EQUAL_LOOKUP = "Lte";
export const CONTAINS_LOOKUP = "Icontains";
export const STARTS_WITH_LOOKUP = "Istartswith";
export const ENUM_PREFIX_LENGTH = 0;
export const STATUS = {
  DRAFT: "A_0",
  VALIDATED: "A_1",
  PAID: "A_2",
  CANCELLED: "A_3",
  DELETED: "A_4",
  SUSPENDED: "A_5",
  UNPAID: "A_6",
  RECONCILIATED: "A_7"
};
export const SUBJECT_TYPE_OPTIONS = [
  {
    value: "contract",
    label: "Contract",
  },
  {
    value: "family",
    label: "Family",
  },
];

export const SUBJECT_TYPE_OPTIONS_BILL = [
  {
    value: "batchrun",
    label: "Batch Run",
  },
  {
    value: "policy",
    label: "Policy",
  },
];

export const THIRDPARTY_TYPE_OPTIONS = [
  {
    value: "insuree",
    label: "Insuree",
  },
  {
    value: "policyholder",
    label: "Policy Holder",
  }
];

export const THIRDPARTY_TYPE_OPTIONS_BILL = [
  {
    value: "healthfacility",
    label: "Health Facility",
  },
  {
    value: "insuree",
    label: "Insuree",
  },
  {
    value: "payer",
    label: "Payer",
  },
  {
    value: "user",
    label: "User",
  }
];

export const WORKER_VOUCHER_HEAD_PANEL_CONTRIB = "workerVoucher.VoucherHeadPanel";
export const INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_CONTRIBUTION_KEY = "invoice.SubjectAndThirdpartyPicker";
export const INVOICE_SUBJECT_AND_THIRDPARTY_PICKER_PROPS = {
  TYPE: "type",
  PICKER: "picker",
  PICKER_PROJECTION: "pickerProjection",
};
export const DEFUALT_DEBOUNCE_TIME = 200;
export const PICKER_NESTED_PROPERTY_REGEX = /^\w+{[\w\s]+}$/;
export const PICKER_NESTED_PROPERTY_NAME_REGEX = /^\w+/;
export const PICKER_NESTED_PROPERTY_PROJECTION_REGEX = /{[\w\s]+}$/;
export const LEGAL_AND_FINANCE_MAIN_MENU_CONTRIBUTION_KEY = "invoice.MainMenu";
export const INVOICE_TABS_PANEL_CONTRIBUTION_KEY = "invoice.TabPanel.panel";
export const INVOICE_TABS_LABEL_CONTRIBUTION_KEY = "invoice.TabPanel.label";
export const INVOICE_LINE_ITEMS_TAB_VALUE = "invoiceLineItemsTab";
export const INVOICE_PAYMENTS_TAB_VALUE = "invoicePaymentsTab";
export const INVOICE_EVENTS_TAB_VALUE = "invoiceEventsTab";
export const BILL_TABS_PANEL_CONTRIBUTION_KEY = "bill.TabPanel.panel";
export const BILL_TABS_LABEL_CONTRIBUTION_KEY = "bill.TabPanel.label";
export const BILL_LINE_ITEMS_TAB_VALUE = "billLineItemsTab";
export const BILL_PAYMENTS_TAB_VALUE = "billPaymentsTab";
export const BILL_EVENTS_TAB_VALUE = "billEventsTab";

export const EMPTY_PAYMENT = {
  status: null,
  codeExt: null,
  codeTp: null,
  codeReceipt: null,
  label: null,
  amountPayed: null,
  fees: null,
  amountReceived: null,
  datePayment: null,
  paymentOrigin: null,
};
export const EMPTY_PAYMENT_INVOICE = {
  status: null,
  codeExt: null,
  codeTp: null,
  codeReceipt: null,
  label: null,
  fees: null,
  amountReceived: null,
  datePayment: null,
  paymentOrigin: null,
  payerRef: null,
  payerName: null,
};
export const PAYMENT_STATUS = {
  REJECTED: "0",
  ACCEPTED: "1",
  REFUNDED: "2",
  CANCELLED: "3",
};
export const PAYMENT_MAIN_STATUS = {
  NOT_RECONCILIATED: "0",
  RECONCILIATED: "1",
  REFUNDED: "2",
  CANCELLED: "3",
};
export const EVENT_TYPE = {
  MESSAGE: "0",
  STATUS: "1",
  WARNING: "2",
  PAYMENT: "3",
  PAYMENT_ERROR: "4",
};
export const EMPTY_EVENT_MESSAGE = {
  eventType: EVENT_TYPE.MESSAGE,
  message: "",
};

export const DEFAULT = {
  IS_WORKER: false,
  ECONOMIC_UNIT_CONFIG: false,
};

// Reference value of the ledger journal type allowed as invoice payment
// destination: a `JournalTypes.code` from the ledger backend reference table
// (OpenIMIS/ledger `tblJournalTypes`). It is sent to the ledger
// `ledgerJournal(type_Code: ...)` query through the LedgerJournalPicker `type`
// prop; see the #37884 contract (invoice payment -> ledger entry meta).
export const PAYMENT_DESTINATION_JOURNAL_TYPE = "treasury";
