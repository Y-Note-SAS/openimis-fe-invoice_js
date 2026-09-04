import React from "react";
import { injectIntl } from "react-intl";
import { SelectInput, formatMessage, withModulesManager } from "@openimis/fe-core";

export const DEFAULT_PAYMENT_ORIGIN_CODES = ["CASH", "CHEQUE", "BANK_TRANSFER", "MOBILE_MONEY", "OTHER"];

const PAYMENT_ORIGIN_CONFIG_KEY = "invoicePayment.paymentOriginOptions";

/** Origin codes come from the module configuration (DB overrides), falling back to the defaults. */
export const getPaymentOriginCodes = (modulesManager) => {
  const configured = modulesManager?.getConf?.("fe-invoice", PAYMENT_ORIGIN_CONFIG_KEY);
  return Array.isArray(configured) && configured.length ? configured : DEFAULT_PAYMENT_ORIGIN_CODES;
};

/** Resolve the localized label of an origin code through the translation files (never hardcoded). */
export const getPaymentOriginLabel = (intl, code) => {
  if (!code) return "";
  const messageId = `invoicePayment.paymentOriginOptions.${code}`;
  const label = formatMessage(intl, "invoice", messageId);
  return label && label !== messageId ? label : code;
};

/** Build the SelectInput options (value = persisted origin code). */
export const getPaymentOriginOptions = (modulesManager, intl, { withNull = false, nullLabel = null } = {}) => {
  const options = getPaymentOriginCodes(modulesManager).map((code) => ({
    value: code,
    label: getPaymentOriginLabel(intl, code),
  }));
  if (withNull) {
    options.unshift({ value: null, label: nullLabel || formatMessage(intl, "invoice", "emptyLabel") });
  }
  return options;
};

const PaymentOriginPicker = ({
  intl,
  modulesManager,
  value,
  onChange,
  label,
  withLabel = true,
  withNull = false,
  nullLabel = null,
  readOnly = false,
  required = false,
}) => (
  <SelectInput
    module="invoice"
    label={withLabel ? label : undefined}
    options={getPaymentOriginOptions(modulesManager, intl, { withNull, nullLabel })}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    required={required}
  />
);

export { PaymentOriginPicker };
export default withModulesManager(injectIntl(PaymentOriginPicker));
