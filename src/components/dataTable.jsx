import { useState, useMemo, useCallback, memo, useEffect, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  ChevronsUpDown,
} from "lucide-react";

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useTableState = ({
  initialPage = 1,
  initialPageSize = 10,
  serverSide = false,
  onServerStateChange = null,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const onServerStateChangeRef = useRef(onServerStateChange);

  useEffect(() => {
    onServerStateChangeRef.current = onServerStateChange;
  }, [onServerStateChange]);

  useEffect(() => {
    if (serverSide && onServerStateChangeRef.current) {
      onServerStateChangeRef.current({
        search: debouncedSearch,
        page: currentPage,
        pageSize,
        sort: sortConfig,
      });
    }
  }, [serverSide, debouncedSearch, currentPage, pageSize, sortConfig]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    sortConfig,
    setSortConfig,
  };
};

/**
 * Hook for client-side filtering and sorting
 */
const useTableData = ({ rows, columns, searchQuery, sortConfig }) => {
  return useMemo(() => {
    let filtered = [...rows];

    if (searchQuery) {
      filtered = filtered.filter((row) =>
        columns.some((col) =>
          String(row[col.field] || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    if (sortConfig.field) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [rows, columns, searchQuery, sortConfig]);
};

const TableHeader = memo(
  ({
    title,
    description,
    searchQuery,
    onSearchChange,
    onFilterClick,
    theme,
    showSearch = true,
    showFilter = true,
  }) => {
    return (
      <div className="px-8 py-8 border-b border-slate-100 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className={theme.heading}>{title}</h2>
            <p className={theme.subheading}>{description}</p>
          </div>

          <div className="flex items-center gap-3">
            {showSearch && (
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search database..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                  }}
                  className={`pl-10 pr-4 py-2.5 w-72 rounded-xl border ${theme.input} focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 focus:bg-white outline-none transition-all duration-200 font-medium`}
                />
              </div>
            )}
            {showFilter && (
              <button
                onClick={onFilterClick}
                className="p-2.5 text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                <Filter className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

const TableColumnHeader = memo(
  ({ column, sortConfig, onSort, theme, sortable = true }) => {
    const isSorted = sortConfig.field === column.field;
    const canSort = sortable && column.sortable !== false;

    return (
      <th
        className={`px-8 py-5 border-b border-slate-100 ${theme.columnHeader} ${
          canSort
            ? "cursor-pointer select-none hover:text-slate-600 transition-colors"
            : ""
        }`}
        onClick={() => canSort && onSort(column.field)}
      >
        <div className="flex items-center gap-2">
          {column.headerName}
          {canSort && (
            <ChevronsUpDown
              className={`h-3 w-3 transition-colors ${
                isSorted
                  ? sortConfig.direction === "asc"
                    ? "text-indigo-500"
                    : "text-indigo-500 rotate-180"
                  : "text-slate-300"
              }`}
            />
          )}
        </div>
      </th>
    );
  }
);

const TableRow = memo(
  ({ row, columns, onRowClick, onActionClick, theme, showActions = true }) => (
    <tr
      className={`group hover:bg-slate-50/50 transition-all duration-150 ${
        onRowClick ? "cursor-pointer" : ""
      }`}
      onClick={() => onRowClick && onRowClick(row)}
    >
      {columns.map((column) => (
        <td key={column.field} className={`px-8 py-6 ${theme.cellText}`}>
          {column.renderCell ? (
            column.renderCell(row)
          ) : (
            <span className="group-hover:text-slate-900 transition-colors">
              {row[column.field]}
            </span>
          )}
        </td>
      ))}
      {showActions && (
        <td className="px-8 py-6 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick && onActionClick(row);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all shadow-sm"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </td>
      )}
    </tr>
  )
);

const TablePagination = memo(
  ({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
    theme,
  }) => (
    <div className="px-8 py-6 flex items-center justify-between bg-white border-t border-slate-100">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Showing {totalItems > 0 ? startIndex + 1 : 0} —{" "}
        {Math.min(endIndex, totalItems)} of {totalItems}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <div className="flex items-center px-4 py-2 text-sm font-bold text-slate-700">
          Page {currentPage} of {totalPages || 1}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
);

const DataTable = ({
  title = "Patient Registry",
  description = "Manage and view visit history",
  rows = [],
  columns = [],

  enableSearch = true,
  enableFilter = true,
  enablePagination = true,
  enableSorting = true,
  showActions = true,

  pageSize = 10,
  serverSide = false,
  serverTotalCount = null,

  onRowClick = null,
  onActionClick = null,
  onFilterClick = null,
  onServerStateChange = null,

  customTheme = {},
}) => {
  const theme = useMemo(
    () => ({
      heading: "text-[24px] font-extrabold text-slate-900 tracking-tight",
      subheading: "text-[15px] font-medium text-slate-500",
      columnHeader:
        "text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]",
      cellText: "text-[14px] font-medium text-slate-600",
      input:
        "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400",
      ...customTheme,
    }),
    [customTheme]
  );

  const {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    currentPage,
    setCurrentPage,
    sortConfig,
    setSortConfig,
  } = useTableState({
    initialPage: 1,
    initialPageSize: pageSize,
    serverSide,
    onServerStateChange,
  });

  const filteredData = useTableData({
    rows: serverSide ? rows : rows,
    columns,
    searchQuery: serverSide ? "" : debouncedSearch,
    sortConfig: serverSide ? { field: null, direction: null } : sortConfig,
  });

  const totalItems = serverSide
    ? serverTotalCount || rows.length
    : filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = serverSide
    ? rows
    : filteredData.slice(startIndex, endIndex);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    },
    [setSearchQuery, setCurrentPage]
  );

  const handleSort = useCallback(
    (field) => {
      setSortConfig((prev) => ({
        field,
        direction:
          prev.field === field && prev.direction === "asc" ? "desc" : "asc",
      }));
      setCurrentPage(1);
    },
    [setSortConfig, setCurrentPage]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
    },
    [setCurrentPage]
  );

  return (
    <div
      className="magic-table w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Header with Search - Fixed */}
      <div className="flex-shrink-0">
        <TableHeader
          title={title}
          description={description}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFilterClick={onFilterClick}
          theme={theme}
          showSearch={enableSearch}
          showFilter={enableFilter}
        />
      </div>

      {/* Table Body - Scrollable area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm">
            <tr>
              {columns.map((column) => (
                <TableColumnHeader
                  key={column.field}
                  column={column}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  theme={theme}
                  sortable={enableSorting}
                />
              ))}
              {showActions && (
                <th className="px-8 py-5 border-b border-slate-100"></th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <TableRow
                  key={row.id || idx}
                  row={row}
                  columns={columns}
                  onRowClick={onRowClick}
                  onActionClick={onActionClick}
                  theme={theme}
                  showActions={showActions}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0)}>
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-slate-300 mb-3">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <div className="text-slate-400 font-semibold text-lg">
                      No records found
                    </div>
                    <div className="text-slate-400 text-sm mt-1">
                      Try adjusting your search or filters
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer - Fixed at bottom */}
      {enablePagination && (
        <div className="flex-shrink-0 border-t border-slate-100">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={handlePageChange}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
