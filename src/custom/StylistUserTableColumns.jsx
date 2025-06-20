import { DeleteOutline, Visibility } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Chip, Button, Switch, CircularProgress } from "@mui/material";
import { CheckCircle2, Eye, PlusCircle, Trash2 } from "lucide-react";
import { CustomIconButton } from "./Button";

export const stylistUserTableColumns = ({ handleToggleStatus, handleDelete, handleView, togglingIds }) => [
    { field: "fullName", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "dob", headerName: "DOB", width: 130 },
    { field: "createdAt", headerName: "Created", width: 150 },
    {
        field: "approved",
        headerName: "Approved",
        width: 140,
        renderCell: (params) => {
            const isLoading = togglingIds?.[params.row.id];

            return (
                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    {isLoading ? (
                        <CircularProgress size={20} color="success" />
                    ) : (
                        <Switch
                            checked={params.row.approved}
                            onChange={(event) => {
                                event.stopPropagation();
                                handleToggleStatus(params.row.id);
                            }}
                            onClick={(event) => event.stopPropagation()}
                            color="success"
                            size="large"
                        />
                    )}
                </Box>
            );
        },
    },
    {
        field: "actions",
        headerName: "Actions",
        flex: 0.5,
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
            <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                <CustomIconButton
                    icon={<Eye size={20} color="white" />}
                    color="rgb(77 141 225)"
                    onClick={() => handleView(params.row)}
                />
                <CustomIconButton
                    icon={<Trash2 size={18} />}
                    color="hsl(0 84.2% 60.2%)"
                    onClick={() => handleDelete(params.row.id)}
                />
            </Box>
        ),
    },
];
