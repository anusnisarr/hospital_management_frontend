// In your parent component (e.g., PatientManagement.jsx)

import { useState, useEffect } from "react";
import DataTable from "../components/dataTable";
import { Chip, Typography } from "@mui/material";
import { MoreHorizontal } from 'lucide-react';
import { getTodayVisits } from "../api/services/visitService";

export default function PatientManagement() {
  const [visitData, setVisitData] = useState({ rows: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const env = import.meta.env;

  // Your existing fetchData function
  useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize, search);
  }, [paginationModel, search]);

  const fetchData = async (page= 1, pageSize= 50, search , sort) => {
    setIsLoading(true);
    try {
      const data = await getTodayVisits(search, paginationModel.page + 1, paginationModel.pageSize , sort);
      setVisitData({ rows: data.data, total: data.total });
    } catch (err) {
      setError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  // Define columns with custom rendering
  const columns = [
{
  field: "tokenNo",
  headerName: "Token",
  width: 120,
  renderCell: (row) => {
    // Check if token exists
    const token = row.tokenNo;

    return (
      <div className="flex items-center justify-start h-full">
        <span className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-900 text-white text-xs font-black tracking-tighter rounded-md shadow-sm border border-slate-900 min-w-[40px]">
          #{token || "—"}
        </span>
      </div>
    );
  }
},
    {
      field: "fullName",
      headerName: "Patient Name",
      width: 180,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.fullName}</Typography>
      )
    },
    { field: "age", headerName: "Age", width: 80 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "appointmentType", headerName: "Type", width: 130 },
    { field: "registrationTime", headerName: "Registration", width: 180 },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => {
        // Logic for muted-pill style
        const statusStyles = {
          Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
          Pending: "bg-amber-50 text-amber-700 border-amber-100",
          Cancelled: "bg-slate-50 text-slate-600 border-slate-200"
        };

        return (
          <span className={`px-3 py-1 rounded-full text-[15px] font-bold border ${statusStyles[row.status] || statusStyles.Cancelled}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: "250px",
      align: "right", // Professional tables usually right-align actions
      renderCell: (row) => (
        <div className="flex items-center justify-end gap-2 pr-2">
          {/* 1. "Done" - Clean Outline Style */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Marking ${row.fullName} as done`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-base font-bold text-slate-600 border border-slate-200 rounded-md hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all group"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
            Done
          </button>

          {/* 2. "Hold" - Subtle Muted Style */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Putting ${row.fullName} on hold`);
            }}
            className="px-3 py-1.5 text-base font-bold text-slate-600 border border-slate-200 rounded-md hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all"
          >
            Hold
          </button>
        </div>
      )
    }
  ];

  // Handler functions
  const handleStatusUpdate = (patientId, newStatus, rowData) => {
    console.log('Update status:', patientId, newStatus);

    // Socket emit
    socket.emit("status-updated", {
      patientId: patientId,
      newStatus: newStatus
    });

    // Update local state
    setVisitData(prev => ({
      ...prev,
      rows: prev.rows.map(row =>
        row.id === patientId ? { ...row, status: newStatus } : row
      )
    }));
  };

  const handleSaveVisit = async (patientId, visitData) => {
    try {
      await axios.patch(
        `${env.VITE_BASE_PATH}/patient/updateMedicalHistory/${patientId}`,
        visitData
      );
      // Refresh data
      fetchData(paginationModel.page, paginationModel.pageSize, search);
      alert("Visit saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save visit");
    }
  };

  const handleViewDetails = (rowData) => {
    console.log('View details for:', rowData);
  };

  const handleSearchChange = (model) => {
    const text = model.quickFilterValues?.join(" ") || "";
    setSearch(text);
  };

  return (
   <div className="p-8 bg-slate-50 min-h-screen">
  
        {/* Error Display */}
        {error && (
          <div className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-2xl mt-4">
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
          </div>
        )}
  
        {/* Loading Overlay - Sticky at top */}
        {isLoading && (
          <div className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-2xl mt-4">
            <div className="mx-4 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-blue-800">Loading visit history...</p>
              </div>
            </div>
          </div>
        )}
  
        <DataTable
          title="Dcotor Screen"
          description="Search & view Patient Data"
          rows={visitData.rows}
          columns={columns}
          pageSize={15}
          serverSide={true}
          serverTotalCount={visitData.total}
          onServerStateChange={fetchData}
          
          onRowClick={(row) => {
      
          }}
          onActionClick={(row) => {
      
          }}
          onFilterClick={() => {
      
          }}
          
          enableSearch={true}
          enablePagination={true}
          enableSorting={true}
          showActions={true}
          
          customTheme={{
            heading: "text-[26px] font-extrabold text-slate-900 tracking-tight",
            subheading: "text-[15px] font-medium text-slate-600",
          }}
        />
      </div>
  );
}