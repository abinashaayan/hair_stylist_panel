import { DeleteOutline, Visibility } from "@mui/icons-material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button } from "@mui/material";
import { Trash2 } from "lucide-react";
import { CustomIconButton } from "./Button";

export const categoryTableColumns = ({ handleAddSubCategory, handleDelete, handleView }) => [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'name',
        headerName: 'Category Name',
        width: 200,
        editable: true,
    },
    {
        field: "actions",
        headerName: "Add Sub Category",
        flex: 0.3,
        sortable: false,
        renderCell: (params) => (
            <CustomIconButton
                icon={<AddCircleIcon />}
                color="green"
                onClick={() => handleAddSubCategory(params.row.id)}
            />
        ),
    },
    {
        field: "view",
        headerName: "Action",
        flex: 0.3,
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={1}>
                <CustomIconButton icon={<Visibility />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
            </Box>
        ),
    }

];
