import React from "react";
import { injectIntl } from "react-intl";
import _debounce from "lodash/debounce";

import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  TextInput,
  NumberInput,
  PublishedComponent,
  formatMessage,
  withModulesManager,
  GRID_RESPONSIVE_STANDARD,
} from "@openimis/fe-core";
import { CONTAINS_LOOKUP, DEFUALT_DEBOUNCE_TIME, PAYMENT_DESTINATION_JOURNAL_TYPE } from "../constants";
import { defaultFilterStyles } from "../util/styles";
import PaymentOriginPicker from "../pickers/PaymentOriginPicker";

const StyledInvoicePaymentsFilter = styled("div")(({ theme }) => ({
  ...defaultFilterStyles(theme),
}));

const InvoicePaymentsFilter = ({ intl, modulesManager, filters, onChangeFilters }) => {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFUALT_DEBOUNCE_TIME);

  const isLedgerEnabled = !!modulesManager.getRef("ledger.LedgerJournalPicker");
  const destinationJournalType = PAYMENT_DESTINATION_JOURNAL_TYPE;

  const filterValue = (filterName) => filters?.[filterName]?.value;

  const filterTextFieldValue = (filterName) => (filters?.[filterName] ? filters[filterName].value : "");

  const setFilter = (filterName, value, filter) =>
    onChangeFilters([{ id: filterName, value: !!value ? value : null, filter: filter || null }]);

  const onChangeStringFilter = (filterName, lookup) => (value) =>
    debouncedOnChangeFilters([
      {
        id: filterName,
        value,
        filter: `${filterName}_${lookup}: "${value}"`,
      },
    ]);

  return (
    <StyledInvoicePaymentsFilter>
      <Grid container className="form">
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <TextInput
            module="invoice"
            label="paymentInvoice.paymentReference"
            value={filterTextFieldValue("codeExt")}
            onChange={onChangeStringFilter("codeExt", CONTAINS_LOOKUP)}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="paymentInvoice.datePayment"
            value={filterValue("datePayment")}
            onChange={(value) => setFilter("datePayment", value, value ? `datePayment: "${value}"` : null)}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <NumberInput
            module="invoice"
            label="paymentInvoice.paymentAmount"
            min={0}
            value={filterValue("amountReceived")}
            onChange={(value) => setFilter("amountReceived", value, value != null ? `amountReceived: ${value}` : null)}
          />
        </Grid>
        <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
          <PaymentOriginPicker
            label="paymentInvoice.paymentOrigin"
            withNull
            nullLabel={formatMessage(intl, "invoice", "any")}
            value={filterValue("paymentOrigin")}
            onChange={(value) => setFilter("paymentOrigin", value, value ? `paymentOrigin_Iexact: "${value}"` : null)}
          />
        </Grid>
        {isLedgerEnabled && (
          <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
            <PublishedComponent
              pubRef="ledger.LedgerJournalPicker"
              type={destinationJournalType}
              label={formatMessage(intl, "invoice", "paymentInvoice.paymentDestination")}
              value={filterValue("paymentDestination")}
              onChange={(journal) => {
                const code = journal?.code || null;
                setFilter("paymentDestination", code, code ? `paymentDestination: "${code}"` : null);
              }}
            />
          </Grid>
        )}
      </Grid>
    </StyledInvoicePaymentsFilter>
  );
};

export { StyledInvoicePaymentsFilter };
export default withModulesManager(injectIntl(InvoicePaymentsFilter));
