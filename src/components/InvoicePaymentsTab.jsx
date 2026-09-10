import React from "react";
import { Tab } from "@mui/material";
import { formatMessage, PublishedComponent, FormattedMessage } from "@openimis/fe-core";
import { INVOICE_PAYMENTS_TAB_VALUE, RIGHT_INVOICE_PAYMENT_SEARCH, RIGHT_INVOICE_PAYMENT_CREATE } from "../constants";
import InvoicePaymentsSearcher from "./InvoicePaymentsSearcher";
import { Grid, Typography } from "@mui/material";
import CreateInvoicePaymentDialog from "../dialogs/CreateInvoicePaymentDialog";

const InvoicePaymentsTabLabel = ({ intl, rights, onChange, tabStyle, isSelected }) =>
  rights?.includes(RIGHT_INVOICE_PAYMENT_SEARCH) && (
    <Tab
      onChange={onChange}
      className={tabStyle(INVOICE_PAYMENTS_TAB_VALUE)}
      selected={isSelected(INVOICE_PAYMENTS_TAB_VALUE)}
      value={INVOICE_PAYMENTS_TAB_VALUE}
      label={formatMessage(intl, "invoice", "invoicePayments.label")}
    />
  );

const InvoicePaymentsTabPanel = ({ rights, value, invoice, setConfirmedAction }) => (
  <PublishedComponent pubRef="policyHolder.TabPanel" module="invoice" index={INVOICE_PAYMENTS_TAB_VALUE} value={value}>
    {rights?.includes(RIGHT_INVOICE_PAYMENT_CREATE) && (
      <Grid container justify="flex-end" alignItems="center" spacing={1}>
        <Grid>
          <Typography>
            <FormattedMessage module="invoice" id="invoicePayment.create.label" />
          </Typography>
        </Grid>
        <Grid>
          <CreateInvoicePaymentDialog invoice={invoice} />
        </Grid>
      </Grid>
    )}
    <InvoicePaymentsSearcher invoice={invoice} rights={rights} setConfirmedAction={setConfirmedAction} />
  </PublishedComponent>
);

export { InvoicePaymentsTabLabel, InvoicePaymentsTabPanel };
