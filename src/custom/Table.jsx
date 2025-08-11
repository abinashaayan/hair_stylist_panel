import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Card, CardContent, LinearProgress, useTheme, useMediaQuery, Typography } from "@mui/material";
import { tokens } from "../theme";
import '../index.css'; // Ensure global styles are loaded

const CustomTable = ({ columns, rows, loading, checkboxSelection = false, noRowsMessage = "No data to show", onSelectionModelChange, selectionModel }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Card sx={{ backgroundColor: colors.primary[400], width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ padding: { xs: "8px", sm: "16px" }, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {loading ? (
                    <Box display="flex" flexDirection="column" gap={2} p={2}>
                        <LinearProgress />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            "& .MuiDataGrid-root": {
                                border: "none",
                                fontSize: { xs: "12px", sm: "14px" }
                            },
                            "& .MuiDataGrid-cell": {
                                border: "none",
                                padding: { xs: "8px 4px", sm: "8px 12px" }
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: colors.gray[900],
                                borderBottom: "none",
                                fontSize: { xs: "12px", sm: "14px" },
                                // padding: { xs: "8px 4px", sm: "8px 12px" }
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: colors.primary[400],
                                overflow: "auto !important",
                                "&::-webkit-scrollbar": {
                                    width: "8px",
                                    height: "8px"
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "transparent"
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
                                    borderRadius: "4px"
                                },
                                "scrollbarWidth": "thin",
                                "scrollbarColor": "#6D295A transparent"
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: colors.gray[900],
                                fontSize: { xs: "12px", sm: "14px" }
                            },
                            "& .MuiDataGrid-toolbarContainer": {
                                color: colors.primary[100],
                                backgroundColor: colors.gray[900],
                                padding: { xs: "8px", sm: "12px" },
                                flexDirection: { xs: "column", sm: "row" },
                                gap: { xs: 1, sm: 2 }
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: colors.primary[500]
                            }
                        }}
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: isMobile ? 5 : 10
                                    }
                                },
                            }}
                            checkboxSelection={checkboxSelection}
                            density={isMobile ? "compact" : "standard"}
                            autoHeight={false}
                            disableColumnMenu={isMobile}
                            disableColumnSelector={isMobile}
                            disableDensitySelector={isMobile}
                            getRowHeight={() => (isMobile ? 52 : "auto")}
                            getRowClassName={(params) => params.row.status === 'expired' ? 'expired-row' : ''}
                            slots={{
                                noRowsOverlay: () => (
                                    <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                                        <Typography>{noRowsMessage}</Typography>
                                    </Box>
                                ),
                            }}
                            sx={{
                                height: { xs: "60vh", sm: "70vh", md: "75vh" },
                                width: "100%"
                            }}
                            onRowSelectionModelChange={(model) => {
                                if (onSelectionModelChange) onSelectionModelChange(model);
                            }}
                            rowSelectionModel={selectionModel}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CustomTable;
