import { Box, Button } from "@mui/material";
import { DeleteOutline, Visibility } from "@mui/icons-material";
import { Trash2 } from "lucide-react";
import { CustomIconButton } from "./Button";

export const userTableColumns = ({ handleToggleStatus, handleDelete, handleView }) => [
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    {
        field: "status",
        headerName: "Status",
        flex: 0.5,
        renderCell: (params) => (
            <Button
                variant="contained"
                color={params.row.status === "active" ? "success" : "error"}
                size="small"
                onClick={(event) => {
                    event.stopPropagation();
                    handleToggleStatus(params.row.id);
                }}
            >
                {params.row.status === "active" ? "Active" : "Inactive"}
            </Button>
        ),
    },
    {
        field: "view",
        headerName: "View",
        flex: 0.3,
        sortable: false,
        renderCell: (params) => (
            <CustomIconButton icon={<Visibility />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
        ),
    },
    {
        field: "delete",
        headerName: "Delete",
        flex: 0.3,
        sortable: false,
        renderCell: (params) => (
            <CustomIconButton icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
        ),
    },
];
