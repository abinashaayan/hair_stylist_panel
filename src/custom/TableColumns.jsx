import { Trash2, Eye, Pencil } from "lucide-react";
import { CustomIconButton } from "./Button";
import { Box, CircularProgress, Switch } from "@mui/material";

export const userTableColumns = ({ handleDelete, handleView }) => [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.6 },
    { field: "city", headerName: "City", flex: 0.6 },
    { field: "gender", headerName: "Gender", flex: 0.6 },
    { field: "createdAt", headerName: "Created", flex: 0.8 },
    {
        field: "view",
        headerName: "View",
        flex: 0.3,
        sortable: false,
        renderCell: (params) => (
            <CustomIconButton icon={<Eye />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
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

export const productCategoryTableColumns = ({ handleToggleStatus, handleDelete, handleView, togglingIds, handleEdit }) => [
    { field: "productName", headerName: "Category Name", flex: 1 },
    {
        field: "approved",
        headerName: "Status",
        width: 120,
        renderCell: (params) => {
            const isLoading = togglingIds?.[params.row.id];
            return (
                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    {isLoading ? (
                        <CircularProgress size={20} color="success" />
                    ) : (
                        <Switch
                            checked={params.row.approved}
                            onChange={() => handleToggleStatus(params.row.id)}
                            onClick={(e) => e.stopPropagation()}
                            color="success"
                            size="medium"
                        />
                    )}
                </Box>
            );
        },
    },
    {
        field: "view",
        headerName: "View",
        width: 100,
        renderCell: (params) => (
            <CustomIconButton icon={<Eye />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
        ),
    },
    {
        field: "edit",
        headerName: "Edit",
        width: 100,
        renderCell: (params) => (
            <CustomIconButton icon={<Pencil />} color="green" onClick={() => handleEdit(params.row)} />
        ),
    },
    {
        field: "delete",
        headerName: "Delete",
        width: 100,
        renderCell: (params) => (
            <CustomIconButton icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
        ),
    },
];

export const serviceTableColumns = ({ handleToggleStatus, handleDelete, handleView, togglingIds }) => [
    { field: "name", headerName: "Service Name", flex: 1 },
    { field: "maxPrice", headerName: "Max Price", flex: 0.8 },
    { field: "minPrice", headerName: "Min Price", flex: 0.8 },
    {
        field: "approved",
        headerName: "Status",
        width: 120,
        renderCell: (params) => {
            const isLoading = togglingIds?.[params.row.id];
            return (
                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    {isLoading ? (
                        <CircularProgress size={20} color="success" />
                    ) : (
                        <Switch
                            checked={params.row.approved}
                            onChange={() => handleToggleStatus(params.row.id)}
                            onClick={(e) => e.stopPropagation()}
                            color="success"
                            size="medium"
                        />
                    )}
                </Box>
            );
        },
    },
    { field: "createdAt", headerName: "Created At", flex: 0.8 },
    {
        field: "view",
        headerName: "View",
        flex: 0.3,
        sortable: false,
        renderCell: (params) => (
            <CustomIconButton icon={<Eye />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
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
