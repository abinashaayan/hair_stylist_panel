import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Card, CardContent, LinearProgress, useTheme } from "@mui/material";
import { tokens } from "../theme";

const CustomTable = ({ columns, rows, loading, checkboxSelection = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Card sx={{backgroundColor: colors.primary[400],}}>
            <CardContent>
                {loading ? (
                    <Box display="flex" flexDirection="column" gap={2} p={2}>
                        <LinearProgress />
                    </Box>
                ) : (
                    // backgroundColor: colors.primary[400],
                    <Box
                        width="100%"
                        height="75vh"
                        sx={{
                            "& .MuiDataGrid-root": { border: "none" },
                            "& .MuiDataGrid-cell": { border: "none" },
                            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.gray[900], borderBottom: "none" },
                            // "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
                            // "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.gray[900] },
                            "& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within": { outline: "none !important" },
                            "& .MuiCheckbox-root": { color: `${colors.gray[200]} !important` },
                            "& .MuiDataGrid-iconSeparator": { color: colors.gray[100] },
                            "& .MuiDataGrid-toolbarContainer": {
                                color: colors.primary[100], 
                                backgroundColor: colors.gray[900], 
                            },
                            "& .MuiSvgIcon-root": {
                                color: colors.primary[100],
                            },
                            "& .MuiButtonBase-root": {
                                color: colors.primary[100],
                            },
                        }}
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            components={{ Toolbar: GridToolbar }}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            checkboxSelection={checkboxSelection}
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
