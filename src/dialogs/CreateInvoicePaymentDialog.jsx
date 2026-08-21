import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FormattedMessage,
  GetIconComponent,
  NumberInput,
  PublishedComponent,
  SelectInput,
  TextInput,
  formatMessage,
  formatMessageWithValues,
  withModulesManager,
} from "@openimis/fe-core";
import { createPaymentInvoiceWithDetail } from "../actions";
import { EMPTY_PAYMENT_INVOICE } from "../constants";
import InvoicePaymentStatusPicker from "../pickers/InvoicePaymentStatusPicker";
import { defaultDialogStyles } from "../util/styles";

const CloseIcon = GetIconComponent("Close");
const AddIcon = GetIconComponent("Add");

const StyledCreateInvoicePaymentDialog = styled("div")(({ theme }) => ({
  ...defaultDialogStyles(theme),
}));

const StyledSection = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .sectionHeader": {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: theme.spacing(0.5, 0.5, 0, 0),
    fontWeight: 600,
  },
  "& .sectionBody": {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

const PAYMENT_ORIGIN_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "OTHER", label: "Other" },
];

const CreateInvoicePaymentDialog = ({ intl, invoice, createPaymentInvoiceWithDetail, modulesManager }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [payment, setPayment] = useState({ invoiceId: invoice?.id, ...EMPTY_PAYMENT_INVOICE });
  const [paymentOrigin, setPaymentOrigin] = useState(null);
  const [otherOrigin, setOtherOrigin] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);

  const isLedgerEnabled = !!modulesManager.getRef("ledger.LedgerJournalPicker");

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setPayment({ invoiceId: invoice?.id, ...EMPTY_PAYMENT_INVOICE });
    setPaymentOrigin(null);
    setOtherOrigin("");
    setSelectedJournal(null);
    setSelectedParty(null);
  };

  const onAttributeChange = (attribute) => (value) => setPayment((prev) => ({ ...prev, [attribute]: value }));

  const handleSave = () => {
    const invoicePayment = { ...payment, paymentOrigin: paymentOrigin === "OTHER" ? otherOrigin : paymentOrigin };
    createPaymentInvoiceWithDetail(
      invoicePayment,
      invoicePayment.invoiceId,
      "invoice",
      formatMessageWithValues(intl, "invoice", "invoicePayment.create.mutationLabel", {
        paymentInvoiceLabel: invoicePayment.codeExt,
        code: invoice?.code,
      }),
    );
    handleClose();
  };

  const canSave = !!payment.codeExt && !!payment.amountReceived && !!payment.datePayment && !!payment.status &&
    (paymentOrigin === "OTHER" ? !!otherOrigin : !!paymentOrigin);

  const renderSectionHeader = (labelId) => (
    <div className="sectionHeader">
      <Typography>{formatMessage(intl, "invoice", labelId)}</Typography>
    </div>
  );

  return (
    <StyledCreateInvoicePaymentDialog>
      <>
        <Fab size="small" color="primary" onClick={handleOpen}>
          <AddIcon />
        </Fab>
        <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid>
                <FormattedMessage module="invoice" id="invoicePayment.createPaymentTitle" />
              </Grid>
              <Grid>
                <IconButton onClick={handleClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent dividers>
            <StyledSection>
              {renderSectionHeader("invoicePayment.paymentInformation")}
              <div className="sectionBody">
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextInput
                      module="invoice"
                      label="invoicePayment.paymentReference"
                      value={payment?.codeExt}
                      onChange={onAttributeChange("codeExt")}
                      required
                    />
                  </Grid>
                  <Grid size={6}>
                    <PublishedComponent
                      pubRef="core.DatePicker"
                      module="invoice"
                      label="invoicePayment.datePayment"
                      value={payment?.datePayment}
                      onChange={onAttributeChange("datePayment")}
                      required
                    />
                  </Grid>
                  <Grid size={6}>
                    <NumberInput
                      module="invoice"
                      label="invoicePayment.paymentAmount"
                      min={0}
                      value={payment?.amountReceived}
                      onChange={onAttributeChange("amountReceived")}
                      required
                    />
                  </Grid>
                  <Grid size={6}>
                    <InvoicePaymentStatusPicker
                      label="invoicePayment.status.label"
                      withNull
                      value={payment?.status}
                      onChange={onAttributeChange("status")}
                      required
                    />
                  </Grid>
                  <Grid size={6}>
                    <SelectInput
                      module="invoice"
                      label="invoicePayment.paymentOrigin"
                      options={PAYMENT_ORIGIN_OPTIONS}
                      value={paymentOrigin}
                      onChange={setPaymentOrigin}
                    />
                  </Grid>
                  {paymentOrigin === "OTHER" && (
                    <Grid size={6}>
                      <TextInput
                        module="invoice"
                        label="invoicePayment.specifyPaymentOrigin"
                        value={otherOrigin}
                        onChange={(v) => setOtherOrigin(v)}
                        required
                      />
                    </Grid>
                  )}
                </Grid>
              </div>
            </StyledSection>

            {isLedgerEnabled && (
              <StyledSection>
                {renderSectionHeader("invoicePayment.accountingInformation")}
                <div className="sectionBody">
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <PublishedComponent
                        pubRef="ledger.LedgerJournalPicker"
                        label={formatMessage(intl, "invoice", "invoicePayment.paymentDestination")}
                        value={selectedJournal}
                        onChange={setSelectedJournal}
                      />
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="body2" gutterBottom>
                        {formatMessage(intl, "invoice", "invoicePayment.thirdPartyAccount")}
                      </Typography>
                      <PublishedComponent
                        pubRef="ledger.PartyPicker"
                        value={selectedParty}
                        onChange={setSelectedParty}
                      />
                    </Grid>
                    {selectedParty && (
                      <Grid size={12}>
                        <Grid container spacing={1}>
                          <Grid size={6}>
                            <Typography variant="body2">
                              {`${formatMessage(intl, "invoice", "invoicePayment.accountCode")}: ${selectedParty?.analyticValueId || ""}`}
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="body2">
                              {`${formatMessage(intl, "invoice", "invoicePayment.accountName")}: ${selectedParty?.displayName || ""}`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </div>
              </StyledSection>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              <FormattedMessage module="invoice" id="dialog.cancel" />
            </Button>
            <Button onClick={handleSave} disabled={!canSave} variant="contained" color="primary">
              <FormattedMessage module="invoice" id="invoicePayment.createPaymentButton" />
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </StyledCreateInvoicePaymentDialog>
  );
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ createPaymentInvoiceWithDetail }, dispatch);

export { StyledCreateInvoicePaymentDialog };
export default withModulesManager(injectIntl(connect(null, mapDispatchToProps)(CreateInvoicePaymentDialog)));
