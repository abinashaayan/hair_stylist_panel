import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Card, CardContent, LinearProgress, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../theme";

const CustomTable = ({ columns, rows, loading, checkboxSelection = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Card sx={{
            backgroundColor: colors.primary[400],
            width: "100%",
            overflow: "hidden"
        }}>
            <CardContent sx={{ padding: { xs: "8px", sm: "16px" } }}>
                {loading ? (
                    <Box display="flex" flexDirection="column" gap={2} p={2}>
                        <LinearProgress />
                    </Box>
                ) : (
                    <Box
                        width="100%"
                        height={{ xs: "60vh", sm: "70vh", md: "75vh" }}
                        sx={{
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
                                padding: { xs: "8px 4px", sm: "8px 12px" }
                            },
                            "& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within": { 
                                outline: "none !important" 
                            },
                            "& .MuiCheckbox-root": { 
                                color: `${colors.gray[200]} !important` 
                            },
                            "& .MuiDataGrid-iconSeparator": { 
                                color: colors.gray[100] 
                            },
                            "& .MuiDataGrid-toolbarContainer": {
                                color: colors.primary[100], 
                                backgroundColor: colors.gray[900],
                                padding: { xs: "8px", sm: "12px" },
                                flexDirection: { xs: "column", sm: "row" },
                                gap: { xs: 1, sm: 2 }
                            },
                            "& .MuiSvgIcon-root": {
                                color: colors.primary[100],
                                fontSize: { xs: "16px", sm: "20px" }
                            },
                            "& .MuiButtonBase-root": {
                                color: colors.primary[100],
                                fontSize: { xs: "12px", sm: "14px" }
                            },
                            "& .MuiDataGrid-footerContainer": {
                                fontSize: { xs: "12px", sm: "14px" }
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: colors.primary[400]
                            },
                            "& .MuiDataGrid-footerContainer": { 
                                borderTop: "none", 
                                backgroundColor: colors.gray[900] 
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
                            sx={{
                                "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                                    outline: "none",
                                },
                                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                                    outline: "none !important",
                                },
                                "& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within": {
                                    outline: "none !important",
                                },
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CustomTable;
