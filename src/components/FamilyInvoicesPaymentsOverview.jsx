import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { Grid, Paper, Divider, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  formatAmount,
  formatDateFromISO,
  formatMessage,
  formatMessageWithValues,
  historyPush,
  PagedDataHandler,
  Table,
  withModulesManager,
  decodeId,
} from "@openimis/fe-core";
import { ACTION_TYPE } from "../reducer";
import { fetchDetailPaymentInvoices, fetchFamilyInvoicePaymentGlobals, fetchFamilyInvoicePaymentOverview } from "../actions";
import { RIGHT_INVOICE_SEARCH } from "../constants";

const StyledFamilyInvoicesPaymentsOverview = styled("div")(({ theme }) => ({
  "& .paper": theme?.paper?.paper ?? {},
  "& .paperHeader": theme?.paper?.header ?? {},
  "& .tableTitle": theme?.table?.title ?? {},
  "& .loadingContainer": {
    minHeight: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .summaryText": {
    fontWeight: 500,
  },
  "& .summaryRow": {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: theme.spacing(6),
    paddingRight: theme.spacing(1),
  },
  "& .summaryCell": {
    textAlign: "right",
    flex: "0 0 auto",
  },
  "& .summaryValue": {
    whiteSpace: "nowrap",
  },
  "& .expandedBlock": {
    padding: theme.spacing(1, 2, 2, 2),
  },
  "& .expandedTitle": {
    marginBottom: theme.spacing(1),
  },
}));

class FamilyInvoicesPaymentsOverview extends PagedDataHandler {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      expandedInvoiceId: null,
      selectedInvoiceId: null,
    };
    this.rowsPerPageOptions = props.modulesManager.getConf(
      "fe-invoice",
      "familyInvoicesPaymentsOverview.rowsPerPageOptions",
      [5, 10, 20],
    );
    this.defaultPageSize = props.modulesManager.getConf("fe-invoice", "familyInvoicesPaymentsOverview.defaultPageSize", 5);
  }

  componentDidMount() {
    this.query();
    this.fetchGlobalsIfNeeded();
  }

  componentDidUpdate(prevProps) {
    if (this.familyChanged(prevProps)) {
      this.setState({ page: 0, afterCursor: null, beforeCursor: null, expandedInvoiceId: null }, () => this.query());
      this.fetchGlobalsIfNeeded(prevProps);
    }
  }

  familyChanged = (prevProps) =>
    (!prevProps.family && !!this.props.family) ||
    (!!prevProps.family && !!this.props.family && (prevProps.family.uuid == null || prevProps.family.uuid !== this.props.family.uuid));

  queryPrms = () => {
    const headInsureeId = this.props.family?.headInsuree?.id ? decodeId(this.props.family.headInsuree.id) : null;
    if (!headInsureeId) return null;
    return [`headInsureeId: "${headInsureeId}"`];
  };

  globalsParams = () => this.queryPrms();

  globalsParamsKey = (params) => (params || []).join("|");

  fetchGlobalsIfNeeded = (prevProps) => {
    const params = this.globalsParams();
    if (!params) return;
    const paramsKey = this.globalsParamsKey(params);
    const prevKey = prevProps?.family?.headInsuree?.id
      ? this.globalsParamsKey([`headInsureeId: "${decodeId(prevProps.family.headInsuree.id)}"`])
      : null;
    if (prevKey === paramsKey && this.props.familyInvoicePaymentGlobalsParamsKey === paramsKey) return;
    this.props.fetchFamilyInvoicePaymentGlobals(params, paramsKey);
  };

  onToggleInvoiceDetails = async (selectedRows) => {
    const invoiceRow = selectedRows?.[0];
    const invoiceId = invoiceRow?.invoiceId;
    if (!invoiceId) {
      if (this.state.selectedInvoiceId && this.state.expandedInvoiceId === this.state.selectedInvoiceId) {
        this.setState({ expandedInvoiceId: null });
      }
      return;
    }
    if (this.state.expandedInvoiceId === invoiceId) {
      this.setState({ expandedInvoiceId: null, selectedInvoiceId: invoiceId });
      return;
    }

    this.setState({ expandedInvoiceId: invoiceId, selectedInvoiceId: invoiceId });

    const cachedInvoicePayments = this.props.invoicePaymentsByInvoiceId?.[invoiceId];
    if (!cachedInvoicePayments) {
      const params = [`subjectType: "invoice"`, `subjectId: "${invoiceId}"`, "isDeleted: false", "payment_IsDeleted: false"];
      await this.props.fetchInvoicePaymentsDetails(invoiceId, params);
    }
  };

  onDoubleClick = (invoiceRow, newTab = false) => {
    if (!invoiceRow?.invoiceId) return;
    historyPush(this.props.modulesManager, this.props.history, "invoice.route.invoice", [invoiceRow.invoiceId], newTab);
  };

  invoiceHeaders = [
    "invoice.familyInvoicesPayments.coveredPeriod",
    "invoice.familyInvoicesPayments.invoiceNumber",
    "invoice.familyInvoicesPayments.amountDue",
    "invoice.familyInvoicesPayments.totalInvoicePayments",
    "invoice.familyInvoicesPayments.lastPayment",
    "invoice.familyInvoicesPayments.invoiceBalance",
  ];

  invoiceFormatters = [
    (invoiceRow) => this.formatCoveredPeriod(invoiceRow),
    (invoiceRow) => invoiceRow?.invoiceCode || "",
    (invoiceRow) => formatAmount(this.props.modulesManager, this.props.intl, invoiceRow?.amountDue || 0),
    (invoiceRow) => formatAmount(this.props.modulesManager, this.props.intl, invoiceRow?.totalInvoicePayments || 0),
    (invoiceRow) =>
      invoiceRow?.lastPayment
        ? formatDateFromISO(this.props.modulesManager, this.props.intl, invoiceRow.lastPayment)
        : "",
    (invoiceRow) => formatAmount(this.props.modulesManager, this.props.intl, invoiceRow?.invoiceBalance || 0),
  ];

  invoicePaymentHeaders = [
    "invoice.familyInvoicesPayments.invoicePaymentDate",
    "invoice.familyInvoicesPayments.invoicePaymentAmount",
    "invoice.familyInvoicesPayments.invoicePaymentReference",
    "invoice.familyInvoicesPayments.invoicePaymentOrigin",
    "invoice.familyInvoicesPayments.invoicePaymentCodeReceipt",
    "invoice.familyInvoicesPayments.invoicePaymentPayerRef",
  ];

  invoicePaymentFormatters = [
    (invoicePayment) =>
      invoicePayment?.payment?.datePayment
        ? formatDateFromISO(this.props.modulesManager, this.props.intl, invoicePayment.payment.datePayment)
        : "",
    (invoicePayment) => formatAmount(this.props.modulesManager, this.props.intl, invoicePayment?.amount || 0),
    (invoicePayment) => invoicePayment?.payment?.codeExt || "",
    (invoicePayment) => invoicePayment?.payment?.paymentOrigin || "",
    (invoicePayment) => invoicePayment?.payment?.codeReceipt || "",
    (invoicePayment) => invoicePayment?.payment?.payerRef || "",
  ];

  formatCoveredPeriod = (invoiceRow) => {
    const coveredFrom = formatDateFromISO(this.props.modulesManager, this.props.intl, invoiceRow?.coveredFrom);
    const coveredTo = formatDateFromISO(this.props.modulesManager, this.props.intl, invoiceRow?.coveredTo);
    if (!invoiceRow?.coveredFrom && !invoiceRow?.coveredTo) return "";
    return `${coveredFrom || ""} - ${coveredTo || ""}`.trim();
  };

  renderExpandedInvoiceDetails() {
    const { expandedInvoiceId } = this.state;
    if (!expandedInvoiceId) return null;

    const invoicePayments = this.props.invoicePaymentsByInvoiceId?.[expandedInvoiceId] || [];
    const isFetchingInvoicePayments = this.props.isFetchingInvoicePaymentsByInvoiceId?.[expandedInvoiceId];
    const invoicePaymentsError = this.props.errorInvoicePaymentsByInvoiceId?.[expandedInvoiceId];
    const expandedInvoice = (this.props.invoiceRows || []).find((row) => row?.invoiceId === expandedInvoiceId);
    const expandedInvoiceNumber = expandedInvoice?.invoiceCode || expandedInvoiceId;

    return (
      <div className="expandedBlock">
        <Typography className="expandedTitle">
          {formatMessageWithValues(this.props.intl, "invoice", "familyInvoicesPayments.invoicePaymentsSectionTitle", {
            invoiceNumber: expandedInvoiceNumber,
            count: invoicePayments.length,
          })}
        </Typography>
        <Table
          module="invoice"
          headers={this.invoicePaymentHeaders}
          itemFormatters={this.invoicePaymentFormatters}
          items={invoicePayments}
          fetching={isFetchingInvoicePayments}
          error={invoicePaymentsError}
        />
      </div>
    );
  }

  render() {
    const {
      family,
      rights,
      invoiceRows,
      invoiceRowsTotalCount,
      isFetchingInvoiceRows,
      invoiceRowsError,
      totalInvoiceAmount,
      totalPaidAmount,
      globalBalance,
    } = this.props;

    if (!this.props.modulesManager.getConf("fe-policy", "enableInvoicePaymentMode", false)) return null;
    if (!family?.headInsuree?.id || !rights.includes(RIGHT_INVOICE_SEARCH)) return null;

    return (
      <StyledFamilyInvoicesPaymentsOverview>
        <Paper className="paper">
          <Grid container alignItems="center" justifyContent="space-between" className="paperHeader">
            <Grid>
              <Typography className="tableTitle">
                {formatMessageWithValues(this.props.intl, "invoice", "familyInvoicesPayments.title", {
                  count: invoiceRowsTotalCount,
                })}
              </Typography>
            </Grid>
            <Grid size={7}>
              <Grid container className="summaryRow">
                <Grid className="summaryCell">
                  <Typography className="summaryText">
                    <strong className="summaryValue">
                      {`${formatMessage(this.props.intl, "invoice", "familyInvoicesPayments.totalInvoiceAmount")}: ${formatAmount(this.props.modulesManager, this.props.intl, totalInvoiceAmount || 0)}`}
                    </strong>
                  </Typography>
                </Grid>
                <Grid className="summaryCell">
                  <Typography className="summaryText">
                    <strong className="summaryValue">
                      {`${formatMessage(this.props.intl, "invoice", "familyInvoicesPayments.totalPaidAmount")}: ${formatAmount(this.props.modulesManager, this.props.intl, totalPaidAmount || 0)}`}
                    </strong>
                  </Typography>
                </Grid>
                <Grid className="summaryCell">
                  <Typography className="summaryText">
                    <strong className="summaryValue">
                      {`${formatMessage(this.props.intl, "invoice", "familyInvoicesPayments.globalBalance")}: ${formatAmount(this.props.modulesManager, this.props.intl, globalBalance || 0)}`}
                    </strong>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider />

          {isFetchingInvoiceRows ? (
            <div className="loadingContainer">
              <CircularProgress />
            </div>
          ) : (
            <>
              <Table
                module="invoice"
                headers={this.invoiceHeaders}
                itemFormatters={this.invoiceFormatters}
                items={invoiceRows}
                error={invoiceRowsError}
                withSelection="single"
                onChangeSelection={this.onToggleInvoiceDetails}
                onDoubleClick={this.onDoubleClick}
                withPagination
                rowsPerPageOptions={this.rowsPerPageOptions}
                defaultPageSize={this.defaultPageSize}
                page={this.currentPage()}
                pageSize={this.currentPageSize()}
                count={invoiceRowsTotalCount}
                onChangePage={this.onChangePage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
              />
              {this.renderExpandedInvoiceDetails()}
            </>
          )}
        </Paper>
      </StyledFamilyInvoicesPaymentsOverview>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: !!state.core?.user?.i_user ? state.core.user.i_user.rights : [],
  family: state.insuree.family || {},
  isFetchingInvoiceRows: state.invoice.fetchingFamilyInvoicePaymentOverview,
  invoiceRowsError: state.invoice.errorFamilyInvoicePaymentOverview,
  invoiceRows: state.invoice.familyInvoicePaymentOverviewItems || [],
  invoiceRowsTotalCount: state.invoice.familyInvoicePaymentOverviewTotalCount || 0,
  pageInfo: state.invoice.familyInvoicePaymentOverviewPageInfo || {},
  totalInvoiceAmount: state.invoice.totalInvoiceAmount || 0,
  totalPaidAmount: state.invoice.totalPaidAmount || 0,
  globalBalance: state.invoice.globalBalance || 0,
  familyInvoicePaymentGlobalsParamsKey: state.invoice.familyInvoicePaymentGlobalsParamsKey,
  invoicePaymentsByInvoiceId: state.invoice.invoicePaymentsByInvoiceId || {},
  isFetchingInvoicePaymentsByInvoiceId: state.invoice.isFetchingInvoicePaymentsByInvoiceId || {},
  errorInvoicePaymentsByInvoiceId: state.invoice.errorInvoicePaymentsByInvoiceId || {},
});

const mapDispatchToProps = (dispatch) => ({
  fetch: (_modulesManager, params) => dispatch(fetchFamilyInvoicePaymentOverview(params)),
  fetchFamilyInvoicePaymentGlobals: (params, paramsKey) =>
    dispatch(fetchFamilyInvoicePaymentGlobals(params, { paramsKey })),
  fetchInvoicePaymentsDetails: async (invoiceId, params) =>
    dispatch(fetchDetailPaymentInvoices(params, ACTION_TYPE.SEARCH_INVOICE_PAYMENTS_OVERVIEW, { invoiceId })),
});

export default withModulesManager(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(FamilyInvoicesPaymentsOverview)),
);
