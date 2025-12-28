import { useMemo } from "react";

export const usePatientColumns = (totalRows, paginationModel) => {
  return useMemo(() => [
  { field: 'createdAt', 
    headerName: 'Creation Date', 
    width: 200 , 
    renderCell: (row) => {
    const date = new Date(row.createdAt);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
    });
  }},
  { field: 'phone', headerName: 'Phone', width: 130 },
  { field: 'fullName', headerName: 'Full Name', width: 130 },
  { field: 'age', headerName: 'Age', type: 'number', width: 10 },
  { field: 'address', headerName: 'Address', width: 300 },
  { field: 'totalVisits', headerName: 'Total Visits', width: 200 },
  { field: 'lastVisitDate', headerName: 'Last Visit Date', width: 200,
    renderCell: (row) => {
    const date = new Date(row.createdAt);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
    });
  }
   },
  { field: 'lastVisitStatus', headerName: 'Last Visit Status', width: 200 },
  { field: 'lastVisitType', headerName: 'Last Visit Type', width: 200 },
  { field: 'emergencyContact', headerName: 'Emergency Contact', width: 200 },
  { field: 'emergencyPhone', headerName: 'Emergency Phone', width: 200 },
  ], [totalRows, paginationModel]);
};

export const columnFields = [
  "createdAt", "phone",
  "fullName", "age","totalVisits", "lastVisitDate", "lastVisitStatus" , "address", "emergencyContact", "emergencyPhone" 
];