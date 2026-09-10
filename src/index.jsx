import React from "react";
import { GetIconComponent } from "@openimis/fe-core";
import { FormattedMessage } from "@openimis/fe-core";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import { flatten } from "flat";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceStatusPicker from "./pickers/InvoiceStatusPicker";
import SubjectTypePickerBill from "./pickers/SubjectTypePickerBill";
import ThirdPartyTypePickerBill from "./pickers/ThirdPartyTypePickerBill";
import InvoicePage from "./pages/InvoicePage";
import BillsPage from "./pages/BillsPage";
import BillPage from "./pages/BillPage";
import { InvoiceLineItemsTabLabel, InvoiceLineItemsTabPanel } from "./components/InvoiceLineItemsTab";
import { InvoicePaymentsTabLabel, InvoicePaymentsTabPanel } from "./components/InvoicePaymentsTab";
import { InvoiceEventsTabLabel, InvoiceEventsTabPanel } from "./components/InvoiceEventsTab";
import { BillLineItemsTabLabel, BillLineItemsTabPanel } from "./components/BillLineItemsTab";
import { BillPaymentsTabLabel, BillPaymentsTabPanel } from "./components/BillPaymentsTab";
import { BillEventsTabLabel, BillEventsTabPanel } from "./components/BillEventsTab";
import FamilyInvoicesPaymentsOverview from "./components/FamilyInvoicesPaymentsOverview";
import { getSubjectAndThirdpartyTypePicker } from "./util/subject-and-thirdparty-picker";
import { fetchBillLineItems } from "./actions";
import {
  RIGHT_INVOICE_SEARCH,
  RIGHT_BILL_SEARCH,
  RIGHT_BILL_AMEND,
  RIGHT_INVOICE_AMEND,
} from "./constants";

const ROUTE_INVOICES = "invoices";
const ROUTE_INVOICE = "invoices/invoice";
const ROUTE_BILLS = "bills";
const ROUTE_BILL = "bills/bill";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: flatten(messages_en) }],
  "reducers": [{ key: "invoice", reducer }],
  "core.MainMenu": [{
    name: 'LegalAndFinanceMainMenu',
    id: "invoice.MainMenu" ,
    icon: "BalanceIcon",
    text: "invoice.mainMenu"
  }],
  "core.Router": [
    { 
      path: ROUTE_INVOICES,
      id: "legalAndFinance.invoices",
      component: InvoicesPage,
      rights: [RIGHT_INVOICE_SEARCH, RIGHT_INVOICE_AMEND],
      icon: "Person",
      text: "menu.invoice"
    },
    { path: ROUTE_INVOICE + "/:invoice_uuid?", id: "legalAndFinance.invoice", component: InvoicePage },
    { 
      path: ROUTE_BILLS, 
      id: "legalAndFinance.bills",
      component: BillsPage,
      rights: [RIGHT_BILL_SEARCH, RIGHT_BILL_AMEND],
      icon: "Business",
      text: "menu.bills"
    },
    { path: ROUTE_BILL + "/:bill_uuid?", id: "legalAndFinance.bill", component: BillPage },
  ],
  "refs": [
    { key: "invoice.route.invoice", ref: ROUTE_INVOICE },
    { key: "invoice.InvoiceStatusPicker", ref: InvoiceStatusPicker },
    { key: "invoice.SubjectTypePickerBill", ref: SubjectTypePickerBill },
    { key: "invoice.ThirdPartyTypePickerBill", ref: ThirdPartyTypePickerBill },
    { key: "bill.route.bill", ref: ROUTE_BILL },
    { key: "bill.util.getSubjectAndThirdpartyTypePicker", ref: getSubjectAndThirdpartyTypePicker },
    { key: "bill.action.fetchBillLineItems", ref: fetchBillLineItems },
  ],
  "invoice.TabPanel.label": [InvoiceLineItemsTabLabel, InvoicePaymentsTabLabel, InvoiceEventsTabLabel],
  "invoice.TabPanel.panel": [InvoiceLineItemsTabPanel, InvoicePaymentsTabPanel, InvoiceEventsTabPanel],
  "bill.TabPanel.label": [BillLineItemsTabLabel, BillPaymentsTabLabel, BillEventsTabLabel],
  "bill.TabPanel.panel": [BillLineItemsTabPanel, BillPaymentsTabPanel, BillEventsTabPanel],
  "insuree.FamilyOverview.panels": [FamilyInvoicesPaymentsOverview],
  "invoice.MainMenu": [
    {
      text: "invoice.menu.invoices",
      route: ROUTE_INVOICES,
     
    },
    {
      text: "invoice.menu.bills",
      route: ROUTE_BILLS,
    }
  ],
};

export const InvoiceModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
