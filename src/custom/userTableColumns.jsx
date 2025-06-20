import { Box, Button } from "@mui/material";
// import { DeleteOutline, Visibility } from "@mui/icons-material";
import { Trash2, Eye } from "lucide-react";
import { CustomIconButton } from "./Button";
// import { CheckCircle, RemoveCircle } from "@mui/icons-material";
// import { Switch } from "@mui/material";

export const userTableColumns = ({ handleToggleStatus, handleDelete, handleView }) => [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.6 },
    { field: "city", headerName: "City", flex: 0.6 },
    { field: "gender", headerName: "Gender", flex: 0.6 },
    { field: "createdAt", headerName: "Created", flex: 0.8 },
    // {
    //     field: "status",
    //     headerName: "Phone Verified",
    //     flex: 0.5,
    //     renderCell: (params) => (
    //         <Box display="flex" alignItems="center" gap={1}>
    //             <Switch
    //                 checked={params.row.status}
    //                 onChange={(event) => {
    //                     event.stopPropagation();
    //                     handleToggleStatus(params.row.id);
    //                 }}
    //                 color="success"
    //                 size="small"
    //             />
    //             {params.row.status ? (
    //                 <CheckCircle style={{ color: "green" }} />
    //             ) : (
    //                 <RemoveCircle style={{ color: "gray" }} />
    //             )}
    //         </Box>
    //     ),
    // },
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
