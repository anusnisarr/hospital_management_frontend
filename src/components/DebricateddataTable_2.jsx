import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box, CircularProgress, Typography } from "@mui/material";

export default function DataTable({
  rows,
  columns,
  total,
  loading,
  error,
  paginationModel,
  onPaginationChange,
onFilterModelChange,
  title,
}) {
  return (
    <Paper
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, flex: "0 0 auto" }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            getRowId={(row) => row.id}
            columns={columns}
            loading={loading}
            pageSizeOptions={[50, 100 , 500 ]}
            pagination
            showToolbar
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationChange}
            onFilterModelChange={onFilterModelChange}
            filterMode="server"
            disableColumnFilter
            disableColumnMenu
            disableDensitySelector
            sx={{
              border: 0,
              height: "100%",
              "& .MuiDataGrid-virtualScroller": { overflowY: "auto !important" }
            }}
          />
        )}
      </Box>
    </Paper>
  );
}
