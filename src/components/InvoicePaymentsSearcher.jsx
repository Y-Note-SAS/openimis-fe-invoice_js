import React, { useRef, useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import {
  formatMessage,
  formatMessageWithValues,
  Searcher,
  formatDateFromISO,
  withModulesManager,
  coreConfirm,
  GetIconComponent,
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchPaymentInvoices, deletePaymentInvoice } from "../actions";
import { DEFAULT_PAGE_SIZE, EMPTY_STRING, RIGHT_INVOICE_PAYMENT_DELETE, ROWS_PER_PAGE_OPTIONS } from "../constants";
import InvoicePaymentsFilter from "./InvoicePaymentsFilter";
import { getPaymentOriginLabel } from "../pickers/PaymentOriginPicker";
import { IconButton, Tooltip } from "@mui/material";
import { ACTION_TYPE } from "../reducer";

const DeleteIcon = GetIconComponent("Delete");

const InvoicePaymentsSearcher = ({
  intl,
  modulesManager,
  rights,
  invoice,
  setConfirmedAction,
  deletePaymentInvoice,
  submittingMutation,
  mutation,
  coreConfirm,
  confirmed,
  fetchPaymentInvoices,
  fetchingPaymentInvoices,
  fetchedPaymentInvoices,
  errorPaymentInvoices,
  paymentInvoices,
  paymentInvoicesPageInfo,
  paymentInvoicesTotalCount,
}) => {
  const [queryParams, setQueryParams] = useState([]);
  const [paymentInvoiceToDelete, setPaymentInvoiceToDelete] = useState(null);
  const [deletedPaymentInvoiceUuids, setDeletedPaymentInvoiceUuids] = useState([]);
  const prevSubmittingMutationRef = useRef();

  const isLedgerEnabled = !!modulesManager.getRef("ledger.LedgerJournalPicker");

  useEffect(() => {
    if (paymentInvoiceToDelete) {
      openDeletePaymentInvoiceConfirmDialog();
    }
  }, [paymentInvoiceToDelete]);

  useEffect(() => {
    if (paymentInvoiceToDelete && confirmed) {
      setDeletedPaymentInvoiceUuids([...deletedPaymentInvoiceUuids, paymentInvoiceToDelete.id]);
    }
    paymentInvoiceToDelete && confirmed !== null && setPaymentInvoiceToDelete(null);
  }, [confirmed]);

  useEffect(() => {
    if (
      prevSubmittingMutationRef.current &&
      !submittingMutation &&
      [ACTION_TYPE.CREATE_PAYMENT_INVOICE_WITH_DETAIL, ACTION_TYPE.UPDATE_INVOICE_PAYMENT].includes(
        mutation?.actionType,
      )
    ) {
      refetch();
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  const deletePaymentInvoiceCallback = () =>
    deletePaymentInvoice(
      paymentInvoiceToDelete,
      formatMessageWithValues(intl, "invoice", "paymentInvoice.delete.mutationLabel", {
        paymentInvoiceLabel: paymentInvoiceToDelete?.codeExt || EMPTY_STRING,
        code: invoice?.code,
      }),
    );

  const openDeletePaymentInvoiceConfirmDialog = () => {
    setConfirmedAction(() => deletePaymentInvoiceCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "paymentInvoice.delete.confirm.title", {
        paymentInvoiceLabel: paymentInvoiceToDelete?.codeExt || EMPTY_STRING,
      }),
      formatMessage(intl, "invoice", "paymentInvoice.delete.confirm.message"),
    );
  };

  const onDelete = (paymentInvoice) => setPaymentInvoiceToDelete(paymentInvoice);

  const fetch = (params) => fetchPaymentInvoices(params);

  const refetch = () => fetch(queryParams);

  const filtersToQueryParams = ({ filters, pageSize, beforeCursor, afterCursor, orderBy }) => {
    const queryParams = Object.keys(filters)
      .filter((f) => !!filters[f]["filter"])
      .map((f) => filters[f]["filter"]);
    !beforeCursor && !afterCursor && queryParams.push(`first: ${pageSize}`);
    if (afterCursor) {
      queryParams.push(`after: "${afterCursor}"`);
      queryParams.push(`first: ${pageSize}`);
    }
    if (beforeCursor) {
      queryParams.push(`before: "${beforeCursor}"`);
      queryParams.push(`last: ${pageSize}`);
    }
    orderBy && queryParams.push(`orderBy: ["${orderBy}"]`);
    setQueryParams(queryParams);
    return queryParams;
  };

  const headers = () => {
    const result = [
      "paymentInvoice.paymentReference",
      "paymentInvoice.datePayment",
      "paymentInvoice.paymentAmount",
      "paymentInvoice.paymentOrigin",
    ];
    if (isLedgerEnabled) {
      result.push("paymentInvoice.paymentDestination");
    }
    return result;
  };

  const itemFormatters = () => {
    const formatters = [
      (paymentInvoice) => paymentInvoice.codeExt,
      (paymentInvoice) =>
        !!paymentInvoice.datePayment
          ? formatDateFromISO(modulesManager, intl, paymentInvoice.datePayment)
          : EMPTY_STRING,
      (paymentInvoice) => paymentInvoice.amountReceived,
      (paymentInvoice) => getPaymentOriginLabel(intl, paymentInvoice?.paymentOrigin),
    ];

    if (isLedgerEnabled) {
      formatters.push((paymentInvoice) => paymentInvoice?.paymentDestination || EMPTY_STRING);
    }

    if (rights.includes(RIGHT_INVOICE_PAYMENT_DELETE)) {
      formatters.push((paymentInvoice) => (
        <Tooltip title={formatMessage(intl, "invoice", "deleteButtonTooltip")}>
          <IconButton
            onClick={() => onDelete(paymentInvoice)}
            disabled={deletedPaymentInvoiceUuids.includes(paymentInvoice.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ));
    }
    return formatters;
  };

  const sorts = () => {
    const result = [
      ["codeExt", true],
      ["datePayment", true],
      ["amountReceived", true],
      ["paymentOrigin", true],
    ];
    if (isLedgerEnabled) {
      result.push(["paymentDestination", true]);
    }
    return result;
  };

  const defaultFilters = () => ({
    subjectIds: {
      value: invoice?.id,
      filter: `subjectIds: ["${invoice?.id}"]`,
    },
    isDeleted: {
      value: false,
      filter: "isDeleted: false",
    },
  });

  const isRowDisabled = (_, paymentInvoice) => deletedPaymentInvoiceUuids.includes(paymentInvoice.id);

  return (
    !!invoice?.id && (
      <Searcher
        module="invoice"
        FilterPane={InvoicePaymentsFilter}
        fetch={fetch}
        items={paymentInvoices}
        itemsPageInfo={paymentInvoicesPageInfo}
        fetchingItems={fetchingPaymentInvoices}
        fetchedItems={fetchedPaymentInvoices}
        errorItems={errorPaymentInvoices}
        tableTitle={formatMessageWithValues(intl, "invoice", "paymentInvoices.searcherResultsTitle", {
          paymentInvoicesTotalCount,
        })}
        filtersToQueryParams={filtersToQueryParams}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        defaultOrderBy="codeExt"
        defaultFilters={defaultFilters()}
        rowDisabled={isRowDisabled}
        rowLocked={isRowDisabled}
      />
    )
  );
};

const mapStateToProps = (state) => ({
  fetchingPaymentInvoices: state.invoice.fetchingPaymentInvoices,
  fetchedPaymentInvoices: state.invoice.fetchedPaymentInvoices,
  errorPaymentInvoices: state.invoice.errorPaymentInvoices,
  paymentInvoices: state.invoice.paymentInvoices,
  paymentInvoicesPageInfo: state.invoice.paymentInvoicesPageInfo,
  paymentInvoicesTotalCount: state.invoice.paymentInvoicesTotalCount,
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchPaymentInvoices,
      deletePaymentInvoice,
      coreConfirm,
    },
    dispatch,
  );

export { InvoicePaymentsSearcher };
export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(InvoicePaymentsSearcher)));
