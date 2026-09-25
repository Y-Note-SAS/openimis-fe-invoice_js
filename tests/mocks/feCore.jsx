import React from "react";
import { vi } from "vitest";

// Stand-in for the parts of @openimis/fe-core the module consumes. fe-core is a
// peer dependency (not installed in this module), so the tests alias it to this
// file. Only the behaviour the tests assert on is implemented; everything else
// is an inert stub that keeps the components importable.

export const defaultModulesManager = {
  getConf: (module, key, defaultValue) => defaultValue,
  get: () => undefined,
};

export const decodeId = (id) => (typeof id === "string" && id.startsWith("enc:") ? id.slice(4) : id);
export const formatMessage = (intl, module, id) => id;
export const formatMessageWithValues = (intl, module, id) => id;
export const formatAmount = (modulesManager, intl, amount) => String(amount ?? 0);
export const formatDateFromISO = (modulesManager, intl, date) => date ?? "";
export const formatSorter = () => "▲";
export const sort = (orderBy, attr, asc) => `${asc ? "" : "-"}${attr}`;
export const formatGQLString = (value) => value;
export const formatJsonField = (value) => value;
export const formatServerError = (payload) => (payload ? { message: payload.message ?? "error" } : null);
export const formatGraphQLError = (payload) =>
  payload?.errors?.length ? { message: payload.errors[0].message } : null;
export const parseData = (data) => (data?.edges ? data.edges.map((edge) => edge.node) : []);
export const pageInfo = { totalCount: 0 };

export const graphql = vi.fn((payload, actionTypes) => ({
  payload,
  actionTypes,
}));
export const graphqlWithVariables = vi.fn((operation, variables, actionTypes) => ({
  operation,
  variables,
  actionTypes,
}));
export const formatPageQuery = vi.fn(
  (name, params = [], fields = []) => `${name}(${params.join(",")}){ ${fields.join(" ")} }`,
);
export const formatPageQueryWithCount = vi.fn(
  (name, params = [], fields = []) => `${name}(${params.join(",")}){ ${fields.join(" ")} }`,
);
export const formatMutation = vi.fn((name) => `mutation-${name}`);
export const dispatchMutationReq = vi.fn();
export const dispatchMutationResp = vi.fn();
export const dispatchMutationErr = vi.fn();
export const clearCurrentPaginationPage = vi.fn();

export const withModulesManager = (Component) => (props) => (
  <Component {...props} modulesManager={props.modulesManager ?? defaultModulesManager} />
);
export const withHistory = (Component) => (props) => (
  <Component {...props} history={props.history ?? { push: vi.fn() }} />
);
export const withTooltip = (component) => component;
export const useModulesManager = () => defaultModulesManager;
export const useTranslations = () => ({ formatMessage: (id) => id });

export const historyPush = vi.fn();
export const coreAlert = vi.fn();
export const coreConfirm = vi.fn();
export const journalize = vi.fn();

export const GetIconComponent = (name) => (props) => <span data-icon={name} {...props} />;
export const Helmet = () => null;
export const FormattedMessage = ({ id }) => <>{id}</>;
export const ProgressOrError = ({ error }) => (error ? <div role="alert">{String(error.message ?? error)}</div> : null);
export const WarningBox = ({ children }) => <div>{children}</div>;
// Minimal stand-in for the CoreModule Searcher: renders the table title, the
// headers and the rows built by `itemFormatters`, and exposes the sortable
// columns (`sorts()` entries, `-` when a column has none) so tests can assert
// the column wiring without the real searcher.
export const Searcher = ({ tableTitle, headers, itemFormatters, sorts, items = [], rowIdentifier }) => {
  const headerList = typeof headers === "function" ? headers() : headers || [];
  const formatters = typeof itemFormatters === "function" ? itemFormatters() : itemFormatters || [];
  const sortsList = typeof sorts === "function" ? sorts() : sorts || [];
  return (
    <div className="mock-searcher">
      {tableTitle ? <div>{tableTitle}</div> : null}
      <div data-testid="searcher-sorts">{sortsList.map((entry) => (entry ? entry[0] : "-")).join(",")}</div>
      <table>
        <thead>
          <tr>
            {headerList.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(items || []).map((item, index) => (
            <tr key={rowIdentifier ? rowIdentifier(item) : index}>
              {formatters.map((formatter, formatterIndex) => (
                <td key={formatterIndex}>{formatter(item, index)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export const Form = ({ children }) => <div>{children}</div>;

// fe-core's FormPanel is a class: ContributionMasterPanel extends it.
export class FormPanel extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
export const PublishedComponent = () => null;
export const ConstantBasedPicker = () => null;
export const NumberInput = (props) => <TextInput {...props} />;
export const SelectInput = ({ label, value, options = [], onChange, readOnly }) => (
  <select
    aria-label={label}
    value={value ?? ""}
    readOnly={readOnly}
    onChange={(event) => onChange?.(event.target.value)}
  >
    {options.map((option) => (
      <option key={String(option.value ?? option)} value={option.value ?? option}>
        {option.label ?? option}
      </option>
    ))}
  </select>
);
export const Contributions = () => null;
export const downloadExport = vi.fn();

export const Table = ({ items = [], itemFormatters = [], error }) =>
  error ? (
    <div role="alert">{String(error.message ?? error)}</div>
  ) : (
    <table>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            {itemFormatters.map((format, cellIndex) => (
              <td key={cellIndex}>{format(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

export const TextInput = ({ label, value, onChange, readOnly }) => (
  <input aria-label={label} value={value ?? ""} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value)} />
);
export const ValidatedTextInput = TextInput;
export const AmountInput = TextInput;

export const GRID_RESPONSIVE_STANDARD = { xs: 12, sm: 6, md: 4, lg: 3 };
export const GRID_RESPONSIVE_FULL = { xs: 12, md: 12, lg: 12 };

// Minimal PagedDataHandler: the real one lives in fe-core and only provides the
// pagination plumbing the module's pages rely on.
export class PagedDataHandler extends React.Component {
  state = {
    orderBy: null,
    page: 0,
    pageSize: 10,
    afterCursor: null,
    beforeCursor: null,
    filters: {},
    selection: [],
  };

  componentDidMount() {}

  componentDidUpdate() {}

  query() {}

  currentPage() {
    return this.state.page ?? 0;
  }

  currentPageSize() {
    return this.state.pageSize ?? this.props.defaultPageSize ?? 10;
  }

  onChangeFilters(filters) {
    this.setState({ filters });
  }

  onChangePage(page) {
    this.setState({ page });
  }

  onChangeRowsPerPage(pageSize) {
    this.setState({ pageSize });
  }

  onChangeSelection(selection) {
    this.setState({ selection });
  }

  onChangeSelectionAll() {}

  rowDisabled() {
    return false;
  }
}
