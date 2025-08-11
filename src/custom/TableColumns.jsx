import { Trash2, Eye, Pencil, TransgenderIcon, Plus, Mail, DollarSign, Gift, Clock, TrendingUp, RefreshCcw, CheckCircle } from "lucide-react";
import { CustomIconButton } from "./Button";
import { Box, Chip, CircularProgress, MenuItem, Rating, Select, Switch, Typography, Tooltip } from "@mui/material";
import ImageWithLoader from "./ImageWithLoader";
import PersonIcon from "@mui/icons-material/Person";

export const userTableColumns = ({ handleDelete, handleView, handleToggleUserStatus, handleReverify, handleEdit, handleSendEmail, sendingEmailIds, reverifyIds }) => [
    { field: "fullName", headerName: "Full Name", flex: 0.4 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobile", headerName: "Mobile", flex: 0.4 },
    {
        field: "otpStatus",
        headerName: "OTP Status",
        flex: 0.5,
        renderCell: (params) => {
            const verified = params.row.isPhoneVerified;
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {verified && (
                        <CheckCircle sx={{ color: "success", fontSize: 16 }} />
                    )}
                    {!verified && (
                        <CustomIconButton
                            size="small"
                            icon={<RefreshCcw fontSize="small" />}
                            loading={reverifyIds[params.row.id]}
                            color="#ff9800"
                            text="Reverify"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReverify(params.row.id);
                            }}
                        />
                    )}
                </Box>
            );
        },
    },
    {
        field: "role",
        headerName: "Role",
        flex: 0.3,
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
    {
        field: "gender",
        headerName: "Gender",
        flex: 0.4,
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
    {
        field: "status",
        headerName: "Status",
        flex: 0.6,
        renderCell: (params) => {
            const status = params.row.status || "active";
            const getStatusColor = (status) => {
                switch (status) {
                    case "active":
                        return "#d0f0c0";
                    case "inactive":
                        return "#ffe0b2";
                    case "banned":
                        return "#f8d7da";
                    default:
                        return "#e0e0e0";
                }
            };
            return (
                <Select
                    value={status}
                    onChange={(e) => handleToggleUserStatus(params.row.id, e.target.value)}
                    size="small"
                    variant="outlined"
                    sx={{
                        minWidth: 120,
                        textTransform: "capitalize",
                        backgroundColor: getStatusColor(status),
                        fontWeight: "bold",
                    }}
                >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="banned">Banned</MenuItem>
                </Select>
            );
        },
    },
    { field: "createdAt", headerName: "Created", flex: 0.4 },
    {
        field: "action",
        headerName: "Action",
        width: 250,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
                <CustomIconButton
                    size="small"
                    icon={
                        sendingEmailIds?.[params.row.id]
                            ? <CircularProgress size={16} color="inherit" />
                            : <Mail size={16} />
                    }
                    color="#D93025"
                    onClick={() => handleSendEmail(params.row)}
                    text="Send"
                />
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton size="small" icon={<Pencil size={16} />} color="green" onClick={() => handleEdit(params.row)} />
                <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
            </Box>
        ),
    },
];

export const productCategoryTableColumns = ({ handleToggleStatus, handleDelete, handleView, togglingIds, handleEdit }) => [
    {
        field: "icon",
        headerName: "Icon",
        width: 100,
        renderCell: (params) => {
            const iconUrl = params.row.icon || "https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png";
            return (
                <ImageWithLoader src={iconUrl} alt="Category Icon" width={40} height={40} style={{ objectFit: "cover", borderRadius: "8px", }} />
            );
        },
    },
    { field: "productName", headerName: "Category Name", flex: 0.6 },
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

export const serviceTableColumns = ({ handleToggleStatus, handleDelete, handleView, togglingIds, handleAddSubService, handleEdit }) => [
    {
        field: "icon",
        headerName: "Icon",
        width: 100,
        renderCell: (params) => {
            const iconUrl = params.row.icon || "https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png";
            return (
                <ImageWithLoader src={iconUrl} alt="Category Icon" width={40} height={40} style={{ objectFit: "cover", borderRadius: "8px", }} />
            );
        },
    },
    { field: "name", headerName: "Service Name", flex: 0.5 },
    // {
    //     field: "minPrice",
    //     headerName: "Min Price ($)",
    //     width: 100,
    //     renderCell: (params) => `$${params.row.minPrice ?? "N/A"}`
    // },
    // {
    //     field: "maxPrice",
    //     headerName: "Max Price ($)",
    //     width: 100,
    //     renderCell: (params) => `$${params.row.maxPrice ?? "N/A"}`
    // },
    {
        field: "addSubService",
        headerName: "Add Sub Services",
        flex: 0.5,
        sortable: false,
        renderCell: (params) => (
            <CustomIconButton
                size="small"
                icon={<Plus size={16} />}
                color="rgb(34, 197, 94)"
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddSubService(params.row);
                }}
                text="Add"
            />
        ),
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
        field: "createdAt",
        headerName: "Created At",
        flex: 0.8,
        renderCell: (params) => {
            const value = params.row.createdAt;
            const [datePart, labelPart] = value.split(" (");
            const isOutdated = value.includes("(Outdated Service)");
            return (
                <Box component="span">
                    {datePart}
                    {isOutdated && (
                        <Box component="span" sx={{ color: 'brown', fontStyle: 'italic', ml: 0.5 }}>
                            ({labelPart})
                        </Box>
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
                {handleEdit && (
                    <CustomIconButton size="small" icon={<Pencil size={16} />} color="green" onClick={() => handleEdit(params.row)} />
                )}
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
            const fallbackUrl = "https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png";
            return (
                <ImageWithLoader src={photoUrl || fallbackUrl} alt="img" width={40} height={40} style={{ objectFit: "cover", borderRadius: "8px", }} />
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
    {
        field: "manufacturer",
        headerName: "Manufacturer",
        flex: 1,
        renderCell: (params) => {
            const manufacturer = params.row.manufacturer;
            const name = typeof manufacturer === "object" && manufacturer?.name
                ? manufacturer.name
                : "N/A";
            return <span>{name}</span>;
        },
    },
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

export const packageTableColumns = ({ handleDelete, handleView, handleEdit, handleServicePricing, handlePromotionalPricing, handlePricingHistory, handleDynamicPricing }) => [
    {
        field: "photo",
        headerName: "Image",
        width: 80,
        renderCell: (params) => {
            const photoUrl = params.row.coverImage;
            const fallbackUrl = "https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png";
            return (
                <ImageWithLoader src={photoUrl || fallbackUrl} alt="img" width={40} height={40} style={{ objectFit: "cover", borderRadius: "8px", }} />
            );
        },
    },
    { field: "title", headerName: "Title", flex: 1 },
    {
        field: "serviceName",
        headerName: "Service",
        flex: 1,
        renderCell: (params) => params.row.serviceId?.name || "N/A",
    },
    {
        field: "subServiceName",
        headerName: "Sub Services",
        flex: 1.5,
        renderCell: (params) => {
            const subServices = Array.isArray(params.row.subService) ? params.row.subService : [];
            return (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {subServices.length > 0
                        ? subServices.map((sub) => (
                            <Chip
                                key={sub._id}
                                label={sub.name}
                                size="small"
                                sx={{
                                    bgcolor: 'info.main',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            />
                        ))
                        : "N/A"}
                </Box>
            );
        },
    },
    {
        field: "price",
        headerName: "Price",
        flex: 0.6,
        renderCell: (params) => (
            <Chip
                label={`₹${params.row.price || 0}`}
                size="small"
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            />
        ),
    },
    {
        field: "discount",
        headerName: "Discount",
        flex: 0.6,
        renderCell: (params) => (
            <Chip
                label={`${params.row.discount || 0}% OFF`}
                size="small"
                sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            />
        ),
    },
    {
        field: "date",
        headerName: "Date",
        flex: 1,
        renderCell: (params) =>
            Array.isArray(params.row.date) && params.row.date[0]
                ? new Date(params.row.date[0]).toLocaleDateString()
                : "N/A",
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
        field: "action",
        headerName: "Action",
        width: 350,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Tooltip title="View Details" arrow>
                    <Box>
                        <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                    </Box>
                </Tooltip>
                <Tooltip title="Edit Package" arrow>
                    <Box>
                        <CustomIconButton size="small" icon={<Pencil size={16} />} color="green" onClick={() => handleEdit(params.row)} />
                    </Box>
                </Tooltip>
                <Tooltip title="Service Pricing" arrow>
                    <Box>
                        <CustomIconButton size="small" icon={<DollarSign size={16} />} color="orange" onClick={() => handleServicePricing(params.row)} />
                    </Box>
                </Tooltip>
                <Tooltip title="Promotional Pricing" arrow>
                    <Box>
                        <CustomIconButton size="small" icon={<Gift size={16} />} color="purple" onClick={() => handlePromotionalPricing(params.row)} />
                    </Box>
                </Tooltip>
                <Tooltip title="Pricing History" arrow>
                    <Box>
                        <CustomIconButton size="small" icon={<Clock size={16} />} color="blue" onClick={() => handlePricingHistory(params.row)} />
                    </Box>
                </Tooltip>
                <Tooltip title="Dynamic Pricing" arrow>
                    <Box>
                        <CustomIconButton size="small" icon={<TrendingUp size={16} />} color="teal" onClick={() => handleDynamicPricing(params.row)} />
                    </Box>
                </Tooltip>
                <Tooltip title="Delete Package" arrow>
                    <Box>
                        <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
                    </Box>
                </Tooltip>
            </Box>
        ),
    },
];

export const orderDetailsTableColumns = ({ handleDelete, handleView }) => [
    {
        field: "photo",
        headerName: "Image",
        width: 80,
        renderCell: (params) => {
            const photoUrl = params.row.coverImage;
            const fallbackUrl = "https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png";

            return (
                <ImageWithLoader src={photoUrl || fallbackUrl} alt="img" width={40} height={40} style={{ objectFit: "cover", borderRadius: "8px", }} />
            );
        },
    },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "about", headerName: "About", flex: 2 },
    {
        field: "serviceName",
        headerName: "Service",
        flex: 1,
        renderCell: (params) => params.row.serviceId?.name || "N/A",
    },
    {
        field: "subServiceName",
        headerName: "Sub Services",
        flex: 1.5,
        renderCell: (params) => {
            const subServices = Array.isArray(params.row.subService) ? params.row.subService : [];
            return (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {subServices.length > 0
                        ? subServices.map((sub) => (
                            <Chip
                                key={sub._id}
                                label={sub.name}
                                size="small"
                                sx={{
                                    bgcolor: 'info.main',
                                    color: 'white',
                                    fontWeight: 'bold',
                                }}
                            />
                        ))
                        : "N/A"}
                </Box>
            );
        },
    },
    {
        field: "price",
        headerName: "Price",
        flex: 0.6,
        renderCell: (params) => (
            <Chip
                label={`₹${params.row.price || 0}`}
                size="small"
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            />
        ),
    },
    {
        field: "discount",
        headerName: "Discount",
        flex: 0.6,
        renderCell: (params) => (
            <Chip
                label={`${params.row.discount || 0}% OFF`}
                size="small"
                sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    fontWeight: 'bold',
                }}
            />
        ),
    },
    {
        field: "date",
        headerName: "Date",
        flex: 1,
        renderCell: (params) =>
            Array.isArray(params.row.date) && params.row.date[0]
                ? new Date(params.row.date[0]).toLocaleDateString()
                : "N/A",
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
        field: "createdAt",
        headerName: "Created At",
        flex: 1,
        renderCell: (params) => params.row.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : 'N/A'
    },
    {
        field: "action",
        headerName: "Action",
        width: 140,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row.id)} />
            </Box>
        ),
    },
];

export const allAppointmentStatusTableColumns = ({ handleDelete, handleView, handleStatusUpdate, handleReschedule }) => [
    {
        field: "user",
        headerName: "User",
        flex: 1,
        renderCell: (params) => params.row.user?.fullName || "N/A",
    },
    {
        field: "userEmail",
        headerName: "User Email",
        flex: 1.5,
        renderCell: (params) => params.row.user?.email || "N/A",
    },
    {
        field: "stylist",
        headerName: "Stylist",
        flex: 1,
        renderCell: (params) => params.row.stylist?.fullName || "N/A",
    },
    {
        field: "service",
        headerName: "Service",
        flex: 1,
        renderCell: (params) => params.row.service?.name || "N/A",
    },
    {
        field: "date",
        headerName: "Date",
        flex: 1,
        renderCell: (params) => params.row.date ? new Date(params.row.date).toLocaleDateString() : "N/A",
    },
    {
        field: "slot",
        headerName: "Slot",
        flex: 1,
        renderCell: (params) => {
            const slot = params.row.slot;
            return slot ? `${slot.from} - ${slot.till}` : "N/A";
        }
    },
    {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        renderCell: (params) => {
            const { status, _id } = params.row;
            const statusOptions = ["pending", "confirmed", "completed", "cancelled"];
            return (
                <select
                    value={status}
                    onChange={e => handleStatusUpdate ? handleStatusUpdate(_id, e.target.value) : undefined}
                    style={{ padding: '4px 8px', borderRadius: 4 }}
                >
                    {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            );
        },
    },
    {
        field: "notes",
        headerName: "Notes",
        flex: 1.5,
        renderCell: (params) => params.row.notes || "N/A"
    },
    {
        field: "createdAt",
        headerName: "Created At",
        flex: 1,
        renderCell: (params) => params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : 'N/A'
    },
    {
        field: "action",
        headerName: "Action",
        width: 180,
        sortable: false,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CustomIconButton size="small" icon={<Eye size={16} />} color="rgb(77 141 225)" onClick={() => handleView(params.row)} />
                <CustomIconButton size="small" icon={<Pencil size={16} />} color="orange" onClick={() => handleReschedule(params.row)} />
                <CustomIconButton size="small" icon={<Trash2 size={16} />} color="hsl(0 84.2% 60.2%)" onClick={() => handleDelete(params.row)} />
            </Box>
        ),
    },
];

export const reviewsTableColumns = ({ handleToggleStatus, handleDelete, handleView, togglingIds, panelType }) => [
    {
        field: "photo",
        headerName: "User Profile",
        width: 80,
        renderCell: (params) => {
            const photoUrl = params.row.userProfileImage;
            const fallbackUrl = "https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png";
            return (
                <ImageWithLoader src={photoUrl || fallbackUrl} alt="img" width={40} height={40} style={{ objectFit: "cover", borderRadius: "8px", }} />
            );
        },
    },
    { field: "userName", headerName: "User Name", flex: 1 },
    {
        field: "ratings",
        headerName: "Rating",
        width: 160,
        renderCell: (params) => (
            <Box display="flex" alignItems="center" gap={1}>
                <Rating name="read-only" value={params.row.ratings} readOnly precision={0.5} size="small" />
                <Box
                    px={1}
                    py={0.3}
                    borderRadius="50%"
                    bgcolor={
                        params.row.ratings >= 4
                            ? "success.main"
                            : params.row.ratings >= 2.5
                                ? "warning.main"
                                : "error.main"
                    }
                    color="white"
                    fontSize="0.75rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={24}
                    height={24}
                >
                    {params.row.ratings}
                </Box>
            </Box>
        )
    },
    { field: "description", headerName: "Description", flex: 2 },
    ...(panelType !== "vendor"
        ? [{
            field: "isVisible",
            headerName: "Visible",
            width: 120,
            renderCell: (params) => {
                const isLoading = togglingIds?.[params.row.id];
                return (
                    <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                        {isLoading ? (
                            <CircularProgress size={20} color="success" />
                        ) : (
                            <Switch
                                checked={params.row.isVisible}
                                onChange={() => handleToggleStatus(params.row.id, params.row.isVisible)}
                                onClick={(e) => e.stopPropagation()}
                                color="success"
                                size="medium"
                            />
                        )}
                    </Box>
                );
            },
        }]
        : []),
    { field: "createdAt", headerName: "Created At", width: 140 },
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


