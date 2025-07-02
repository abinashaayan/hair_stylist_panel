import { Trash2, Eye, Pencil, TransgenderIcon } from "lucide-react";
import { CustomIconButton } from "./Button";
import { Box, Chip, CircularProgress, Switch } from "@mui/material";
import ImageWithLoader from "./ImageWithLoader";
import PersonIcon from "@mui/icons-material/Person";

export const userTableColumns = ({ handleDelete, handleView }) => [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    {
        field: "role",
        headerName: "Role",
        flex: 0.6,
        renderCell: (params) => (
            <Chip
                icon={<PersonIcon sx={{ color: "white" }} />}
                label={params.row.role || "N/A"}
                size="small"
                variant="filled"
                sx={{
                    bgcolor: 'primary.main', 
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                }}
            />
        ),
    },
    { field: "city", headerName: "City", flex: 0.6 },
    {
        field: "gender",
        headerName: "Gender",
        flex: 0.6,
        renderCell: (params) => {
            const gender = params.row.gender?.toLowerCase();
            let chipColor = "default";
            if (gender === "male") chipColor = "info.main"; // 🔵
            else if (gender === "female") chipColor = "pink"; // 🎀
            else if (gender === "other") chipColor = "warning.main"; // 🟠
            return (
                <Chip
                    icon={<TransgenderIcon sx={{ color: "white" }} />}
                    label={params.row.gender || "N/A"}
                    size="small"
                    variant="filled"
                    sx={{
                        bgcolor: chipColor,
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                    }}
                />
            );
        },
    },
    { field: "createdAt", headerName: "Created", flex: 0.8 },
    {
        field: "action",
        headerName: "Action",
        width: 180,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <CustomIconButton
                    size="small"
                    icon={<Eye size={16} />}
                    color="rgb(77 141 225)"
                    onClick={() => handleView(params.row)}
                />
                <CustomIconButton
                    size="small"
                    icon={<Trash2 size={16} />}
                    color="hsl(0 84.2% 60.2%)"
                    onClick={() => handleDelete(params.row.id)}
                />
            </Box>
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
        field: "action",
        headerName: "Action",
        width: 180,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton size="small" icon={<Pencil size={16} />} color="green" onClick={() => handleEdit(params.row)} />
                <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
            </Box>
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
        field: "action",
        headerName: "Action",
        width: 180,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
            </Box>
        ),
    },
];

export const ProductTableColumns = ({ handleDelete, handleView, handleEdit }) => [
    {
        field: "photo",
        headerName: "Image",
        width: 80,
        renderCell: (params) => {
            const photoUrl = params.row.photos && params.row.photos.length > 0 ? params.row.photos[0] : null;
            if (!photoUrl) {
                return <span><img src="https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png" alt="img" height={40} width={40} /></span>;
            }
            return (
                <ImageWithLoader src={photoUrl} alt={params.row.name} />
            );
        },
    },
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "subtitle", headerName: "Subtitle", flex: 1 },
    {
        field: "price",
        headerName: "Price",
        flex: 0.7,
        renderCell: (params) => {
            const priceVal = Number(params.row.price?.replace(/[^0-9.]/g, "")) || 0;
            let chipColor = 'error.main';
            if (priceVal < 50) chipColor = 'success.main';
            else if (priceVal <= 200) chipColor = 'warning.main';
            return (
                <Chip
                    label={params.row.price}
                    size="small"
                    variant="filled"
                    sx={{
                        bgcolor: chipColor,
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                />
            );
        },
    },
    {
        field: "stockQuantity",
        headerName: "Stock",
        flex: 0.7,
        renderCell: (params) => {
            const quantity = Number(params.row.stockQuantity) || 0;
            let chipColor = 'error.main';
            if (quantity > 10) chipColor = 'success.main';
            else if (quantity > 0) chipColor = 'warning.main';
            return (
                <Chip
                    label={quantity}
                    size="small"
                    variant="filled"
                    sx={{
                        bgcolor: chipColor,
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                />
            );
        },
    },
    { field: "manufacturer", headerName: "Manufacturer", flex: 1, renderCell: (params) => params.row.manufacturer?.name || 'N/A' },
    { field: "goodToKnow", headerName: "Good To Know", flex: 1 },
    {
        field: "inStock",
        headerName: "In Stock",
        width: 120,
        renderCell: (params) => (
            <Chip
                label={params.row.inStock ? "Yes" : "No"}
                size="small"
                variant="filled"
                sx={{
                    bgcolor: params.row.inStock ? 'success.main' : 'error.main',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            />
        ),
    },
    { field: "createdAt", headerName: "Created At", flex: 0.8 },
    {
        field: "action",
        headerName: "Action",
        width: 150,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton size="small" icon={<Pencil size={16} />} color="green" onClick={() => handleEdit(params.row)} />
                <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
            </Box>
        ),
    },
];

export const serviceManagementTableColumns = ({ handleToggleStatus, handleDelete, handleView, togglingIds }) => [
    { field: "serviceName", headerName: "Service Name", flex: 1 },
    { field: "subServiceName", headerName: "Sub Service Name", flex: 1 },
    {
        field: "price",
        headerName: "Price",
        flex: 0.7,
        renderCell: (params) => {
            const duration = Number(params.row.price || 0);
            let chipColor = 'success.main';
            if (duration > 120) chipColor = 'error.main';
            else if (duration > 60) chipColor = 'warning.main';
            return (
                <Chip
                    label={`$ ${duration}`}
                    size="small"
                    variant="filled"
                    sx={{
                        bgcolor: chipColor,
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                />
            );
        },
    },
    {
        field: "duration",
        headerName: "Duration (min)",
        flex: 0.7,
        renderCell: (params) => {
            const duration = Number(params.row.duration || 0);
            let chipColor = 'success.main';
            if (duration > 120) chipColor = 'error.main';
            else if (duration > 60) chipColor = 'warning.main';
            return (
                <Chip
                    label={`${duration} min`}
                    size="small"
                    variant="filled"
                    sx={{
                        bgcolor: chipColor,
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                />
            );
        },
    },
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
        field: "action",
        headerName: "Action",
        width: 150,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                {/* <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} /> */}
            </Box>
        ),
    },
];

export const packageTableColumns = ({ handleDelete, handleView, handleEdit }) => [
    {
        field: "photo",
        headerName: "Image",
        width: 80,
        renderCell: (params) => {
            const photoUrl = params.row.photos && params.row.photos.length > 0 ? params.row.photos[0] : null;
            if (!photoUrl) {
                return <span><img src="https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png" alt="img" height={40} width={40} /></span>;
            }
            return (
                <ImageWithLoader src={photoUrl} alt={params.row.name} />
            );
        },
    },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "about", headerName: "About", flex: 2 },
    { field: "serviceName", headerName: "Service", flex: 1, renderCell: (params) => params.row.service?.name || params.row.serviceName || 'N/A' },
    { field: "subServiceName", headerName: "Sub Service", flex: 1, renderCell: (params) => params.row.subService?.name || params.row.subServiceName || 'N/A' },
    { field: "date", headerName: "Date", flex: 1, renderCell: (params) => params.row.date ? new Date(params.row.date).toLocaleDateString() : 'N/A' },
    {
        field: "duration",
        headerName: "Duration (min)",
        flex: 0.7,
        renderCell: (params) => {
            const duration = Number(params.row.duration || 0);
            let chipColor = 'success.main';
            if (duration > 120) chipColor = 'error.main';
            else if (duration > 60) chipColor = 'warning.main';
            return (
                <Chip
                    label={`${duration} min`}
                    size="small"
                    variant="filled"
                    sx={{
                        bgcolor: chipColor,
                        color: 'white',
                        fontWeight: 'bold',
                    }}
                />
            );
        },
    },
    { field: "createdAt", headerName: "Created At", flex: 1, renderCell: (params) => params.row.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : 'N/A' },
    {
        field: "action",
        headerName: "Action",
        width: 180,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton size="small" icon={<Pencil size={16} />} color="green" onClick={() => handleEdit(params.row)} />
                <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
            </Box>
        ),
    },
];


