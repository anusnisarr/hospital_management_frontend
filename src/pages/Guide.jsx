import { useState } from "react";
import DataTable from "../components/DataTable";

// Demo Component showing usage
export const DataTableGuide = () => {
  const [selectedRow, setSelectedRow] = useState(null);

  // Sample data
  const sampleRows = [
    {
      id: 1,
      tokenNo: "TKN001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "+1234567890",
      status: "waiting",
      type: "Follow-up",
      time: "09:30 AM"
    },
    {
      id: 2,
      tokenNo: "TKN002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      phone: "+1234567891",
      status: "in-progress",
      type: "New Visit",
      time: "10:00 AM"
    },
    {
      id: 3,
      tokenNo: "TKN003",
      name: "Michael Brown",
      age: 58,
      gender: "Male",
      phone: "+1234567892",
      status: "completed",
      type: "Emergency",
      time: "10:15 AM"
    },
    {
      id: 4,
      tokenNo: "TKN004",
      name: "Emma Wilson",
      age: 28,
      gender: "Female",
      phone: "+1234567893",
      status: "hold",
      type: "Checkup",
      time: "10:30 AM"
    },
    {
      id: 5,
      tokenNo: "TKN005",
      name: "David Lee",
      age: 41,
      gender: "Male",
      phone: "+1234567894",
      status: "waiting",
      type: "Follow-up",
      time: "10:45 AM"
    }
  ];

  // Define columns with custom rendering
  const columns = [
    {
      field: "tokenNo",
      headerName: "Token",
      width: "120px",
      renderCell: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.tokenNo}
        </span>
      )
    },
    {
      field: "name",
      headerName: "Patient Name",
      width: "200px",
      renderCell: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      )
    },
    {
      field: "age",
      headerName: "Age",
      width: "80px",
      align: "center"
    },
    {
      field: "gender",
      headerName: "Gender",
      width: "100px"
    },
    {
      field: "phone",
      headerName: "Phone",
      width: "140px"
    },
    {
      field: "type",
      headerName: "Type",
      width: "130px"
    },
    {
      field: "status",
      headerName: "Status",
      width: "130px",
      renderCell: (row) => {
        const colors = {
          waiting: "bg-yellow-100 text-yellow-800",
          "in-progress": "bg-blue-100 text-blue-800",
          completed: "bg-green-100 text-green-800",
          hold: "bg-gray-100 text-gray-800"
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              colors[row.status]
            }`}
          >
            {row.status}
          </span>
        );
      }
    },
    {
      field: "time",
      headerName: "Time",
      width: "120px"
    },
    {
      field: "actions",
      headerName: "Actions",
      width: "250px",
      align: "center",
      renderCell: (row) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Marking ${row.name} as done`);
            }}
            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            Done
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Putting ${row.name} on hold`);
            }}
            className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
          >
            Hold
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row);
            }}
            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            Details
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reusable Data Table Component
          </h1>
          <p className="text-gray-600">
            A flexible table component with search, pagination, and custom rendering
          </p>
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">How to Use:</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`<DataTable
  rows={yourDataArray}
  columns={columnDefinitions}
  onRowClick={(row) => console.log(row)}
  searchable={true}
  pagination={true}
  pageSize={10}
  rowsPerPageOptions={[5, 10, 20, 50]}
  emptyMessage="No data found"
  searchPlaceholder="Search patients..."
/>`}
          </pre>
        </div>

        {/* Table Demo */}
        <DataTable
          rows={sampleRows}
          columns={columns}
          onRowClick={(row) => setSelectedRow(row)}
          searchable={true}
          searchPlaceholder="Search by name, token, or phone..."
          pagination={true}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          emptyMessage="No patients found"
        />

        {/* Selected Row Display */}
        {selectedRow && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Selected Patient Details
                </h3>
                <div className="text-sm text-blue-800">
                  <p><strong>Name:</strong> {selectedRow.name}</p>
                  <p><strong>Token:</strong> {selectedRow.tokenNo}</p>
                  <p><strong>Age:</strong> {selectedRow.age}, <strong>Gender:</strong> {selectedRow.gender}</p>
                  <p><strong>Phone:</strong> {selectedRow.phone}</p>
                  <p><strong>Status:</strong> {selectedRow.status}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Column Definition Example */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Column Definition Format:</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`const columns = [
  {
    field: "name",              // Field key from data object
    headerName: "Patient Name", // Display name in header
    width: "200px",             // Column width (optional)
    align: "left",              // Text alignment (optional)
    wrap: false,                // Allow text wrapping (optional)
    headerClassName: "",        // Custom header class (optional)
    cellClassName: "",          // Custom cell class (optional)
    renderCell: (row) => (      // Custom cell renderer (optional)
      <div>{row.name}</div>
    )
  }
];`}
          </pre>
        </div>

        {/* Props Documentation */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-3">Available Props:</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Prop</th>
                  <th className="px-4 py-2 text-left font-semibold">Type</th>
                  <th className="px-4 py-2 text-left font-semibold">Default</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-2 font-mono">rows</td>
                  <td className="px-4 py-2">Array</td>
                  <td className="px-4 py-2">[]</td>
                  <td className="px-4 py-2">Array of data objects to display</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">columns</td>
                  <td className="px-4 py-2">Array</td>
                  <td className="px-4 py-2">[]</td>
                  <td className="px-4 py-2">Column definitions with field, headerName, etc.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">onRowClick</td>
                  <td className="px-4 py-2">Function</td>
                  <td className="px-4 py-2">null</td>
                  <td className="px-4 py-2">Callback when row is clicked</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">searchable</td>
                  <td className="px-4 py-2">Boolean</td>
                  <td className="px-4 py-2">true</td>
                  <td className="px-4 py-2">Enable/disable search functionality</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">pagination</td>
                  <td className="px-4 py-2">Boolean</td>
                  <td className="px-4 py-2">true</td>
                  <td className="px-4 py-2">Enable/disable pagination</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">pageSize</td>
                  <td className="px-4 py-2">Number</td>
                  <td className="px-4 py-2">10</td>
                  <td className="px-4 py-2">Initial number of rows per page</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">rowsPerPageOptions</td>
                  <td className="px-4 py-2">Array</td>
                  <td className="px-4 py-2">[5,10,20,50]</td>
                  <td className="px-4 py-2">Options for rows per page dropdown</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">emptyMessage</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">"No data available"</td>
                  <td className="px-4 py-2">Message shown when table is empty</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">searchPlaceholder</td>
                  <td className="px-4 py-2">String</td>
                  <td className="px-4 py-2">"Search..."</td>
                  <td className="px-4 py-2">Placeholder text for search input</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono">hoverEffect</td>
                  <td className="px-4 py-2">Boolean</td>
                  <td className="px-4 py-2">true</td>
                  <td className="px-4 py-2">Enable/disable row hover effect</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


// ============================================================================
// EXAMPLE USAGE
// ============================================================================

export const myDataTableGuide = () => {
  const sampleData = Array.from({ length: 250 }, (_, i) => ({
    id: i + 1,
    patientName: `Patient ${i + 1}`,
    mrn: `MRN${String(i + 1).padStart(6, '0')}`,
    lastVisit: new Date(2024, 0, 1 + (i % 365)).toLocaleDateString(),
    status: ['Active', 'Pending', 'Completed'][i % 3],
    visits: Math.floor(Math.random() * 20) + 1,
  }));

  const columns = [
    { field: 'patientName', headerName: 'Patient Name', sortable: true },
    { field: 'mrn', headerName: 'MRN', sortable: true },
    { field: 'lastVisit', headerName: 'Last Visit', sortable: true },
    { 
      field: 'status', 
      headerName: 'Status',
      sortable: true,
      renderCell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          row.status === 'Active' ? 'bg-green-100 text-green-700' :
          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {row.status}
        </span>
      )
    },
    { field: 'visits', headerName: 'Total Visits', sortable: true },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <DataTable
        title="Patient Registry"
        description="Manage and view patient visit history"
        rows={sampleData}
        columns={columns}
        pageSize={15}
        onRowClick={(row) => console.log('Row clicked:', row)}
        onActionClick={(row) => console.log('Action clicked:', row)}
        onFilterClick={() => console.log('Filter clicked')}
        enableSearch={true}
        enablePagination={true}
        enableSorting={true}
        showActions={true}
      />
    </div>
  );
};
