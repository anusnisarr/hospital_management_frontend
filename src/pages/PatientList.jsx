import { useState, useCallback, useRef } from 'react';
import { usePatientColumns , columnFields } from '../constants/patientColumns'
import { getPatient } from "../api/services/patientService";
import DataTable from '../components/DataTable';
import { useNavigate } from 'react-router-dom';

export default function PatientList() {
  const [patientData, setPatentData] = useState({ rows: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const requestIdRef = useRef(null);

  const columns = usePatientColumns(patientData.total, { page: 0, pageSize: 15 });

  const fetchData = useCallback(async ( params) => {

    const { search, page, pageSize, sort } = params;
    setIsLoading(true);
    setError(null);

    const requestId = Date.now();  
    requestIdRef.current = requestId;

    try {

        const data = await getPatient(search , page, pageSize, columnFields, sort );
        if (requestIdRef.current !== requestId) return;

        setPatentData({ rows: data.data, total: data.total });

    } catch (err) {

        if (requestIdRef.current !== requestId) return;
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch visit history.";
      setError(errorMsg);
      console.log("Fetch Error:", err);

    } finally {

        if (requestIdRef.current === requestId) setIsLoading(false);

    }
  }, []);
  
   return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-sm font-medium text-red-800">{error}</p>
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
        title="Patient List"
        description="Search & view Patient Data"
        rows={patientData.rows}
        columns={columns}
        pageSize={15}
        
        serverSide={true}
        serverTotalCount={patientData.total}
        onServerStateChange={fetchData}
        
        onRowClick={(row) => {
          navigate(`/patient/${row.id || row._id}`);
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



