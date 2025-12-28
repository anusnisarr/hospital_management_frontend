import { useMemo } from "react";

export const useVisitColumns = (totalRows, paginationModel) => {
  return useMemo(() => [
    {
      field: "registrationDate",
      headerName: "Registration Date",
      width: 200,
      renderCell: (row) => {
        const date = new Date(row.registrationDate);
        return date.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          hour12: true,
        });
      }
    },
    { field: "tokenNo", headerName: "Token No", width: 130 },
    { field: "fullName", headerName: "Full Name", width: 130 },
    { field: "appointmentType", headerName: "Appointment Type", width: 130 },
    { field: "priority", headerName: "Priority", width: 130 },
   {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => {
        // Logic for muted-pill style
        const statusStyles = {
          Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
          waiting: "bg-amber-50 text-amber-700 border-amber-100",
          Cancelled: "bg-slate-50 text-slate-600 border-slate-200"
        };

        return (
          <span className={`px-3 py-1 rounded-full text-[15px] font-bold border ${statusStyles[row.status] || statusStyles.Cancelled}`}>
            {row.status}
          </span>
        );
      }
    },
  ], [totalRows, paginationModel]);
};

export const columnFields = [
  "registrationDate", "tokenNo",
  "fullName", "age", "appointmentType", "priority", "status"
];
