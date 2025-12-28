import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Filter } from 'lucide-react';

const DataTable = ({
  title = "Patient Registry",
  description = "Manage and view visit history",
  rows = [],
  columns = [],
  onRowClick = null,
  searchPlaceholder = "Search records...",
  pageSize = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize] = useState(pageSize);

  const filteredRows = rows.filter((row) =>
    columns.some((col) => String(row[col.field] || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredRows.length / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

const theme = {
    heading: "text-[24px] font-extrabold text-slate-900 tracking-tight",
    subheading: "text-[15px] font-medium text-slate-500",
    columnHeader: "text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]",
    cellText: "text-[14px] font-medium text-slate-600",
    input: "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400"
  };

  return (
    <div className={`magic-table w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden`}>
      
      {/* 1. TOP HEADER: Search & Global Actions */}
      <div className="px-8 py-8 border-b border-slate-100 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className={theme.heading}>{title}</h2>
            <p className={theme.subheading}>{description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={`pl-10 pr-4 py-2.5 w-72 rounded-xl border ${theme.input} focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 focus:bg-white outline-none transition-all duration-200 font-medium`}
              />
            </div>
            <button className="p-2.5 text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABLE BODY */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/40">
              {columns.map((column) => (
                <th key={column.field} className={`px-8 py-5 border-b border-slate-100 ${theme.columnHeader}`}>
                  {column.headerName}
                </th>
              ))}
              <th className="px-8 py-5 border-b border-slate-100"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedRows.map((row, idx) => (
              <tr key={idx} className="group hover:bg-slate-50/50 transition-all duration-150">
                {columns.map((column) => (
                  <td key={column.field} className={`px-8 py-6 ${theme.cellText}`}>
                    {column.renderCell ? column.renderCell(row) : (
                      <span className="group-hover:text-slate-900 transition-colors">{row[column.field]}</span>
                    )}
                  </td>
                ))}
                <td className="px-8 py-6 text-right">
                   <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all shadow-sm">
                      <MoreHorizontal className="h-5 w-5" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. PAGINATION FOOTER */}
      <div className="px-8 py-6 flex items-center justify-between bg-white border-t border-slate-100">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
           Showing {filteredRows.length > 0 ? startIndex + 1 : 0} — {Math.min(endIndex, filteredRows.length)} of {filteredRows.length}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable