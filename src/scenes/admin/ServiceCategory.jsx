import {
    Box,
    IconButton,
    InputBase,
    useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, PersonAdd } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import CreateSubservices from "../../components/CreateSubservices";
import EntityDialog from "../../components/EntityDialog";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { serviceTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";

export default function ServiceCategory() {
    const [allServices, setAllServices] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [togglingIds, setTogglingIds] = useState({});
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isViewDialog, setIsViewDialog] = useState(false);
    const [viewValue, setViewValue] = useState("");
    const [viewStatus, setViewStatus] = useState(undefined);
    const [openSubCategoryDialog, setOpenSubCategoryDialog] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editService, setEditService] = useState(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const authToken = Cookies.get("token");

    const fetchAllServices = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/service/admin/get`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            console.log(response?.data?.allServices, 'response?.data');
            if (response?.data?.status === 200) {
                const formattedData = response?.data?.allServices?.map((service) => ({
                    id: service._id,
                    icon: service.icon,
                    name: service.name || "N/A",
                    minPrice: service.minPrice || "N/A",
                    maxPrice: service.maxPrice || "N/A",
                    approved: !!service.isActive,
                    createdAt: service.createdAt
                        ? (() => {
                            const createdDate = new Date(service.createdAt);
                            const today = new Date();
                            const formattedDate = createdDate.toLocaleDateString();
                            const isOutdated = createdDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            return isOutdated ? `${formattedDate} (Outdated Service)` : formattedDate;
                        })()
                        : "N/A",
                }));
                setAllServices(formattedData);
            }
        } catch (error) {
            showErrorToast("Error fetching services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchAllServices();
        }
    }, [authToken]);

    useEffect(() => {
        if (searchText === "") {
            setFilteredUsers(allServices);
        } else {
            setFilteredUsers(
                allServices.filter((service) =>
                    service.name.toLowerCase().includes(searchText)
                )
            );
        }
    }, [allServices, searchText]);

    const handleToggleStatus = async (id) => {
        setTogglingIds((prev) => ({ ...prev, [id]: true }));
        try {
            const response = await axios.patch(`${API_BASE_URL}/service/admin/toggle/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log('Toggle response:', response.data.data);
            showSuccessToast(response?.data?.message || "Service status updated!");
            await fetchAllServices();
        } catch (error) {
            console.log("Toggle error:", error);
            showErrorToast("An error occurred while toggling approval.");
        } finally {
            setTogglingIds((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleOpenCategory = () => {
        setOpenCategoryDialog(true);
    };

    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/service/admin/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.data?.status === 200) {
                showSuccessToast(response?.data?.message || "Service deleted successfully");
                setAllServices((prevServices) => prevServices.filter((service) => service.id !== deleteId));
                setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteId));
            } else {
                showErrorToast("Failed to delete service.");
            }
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
        } finally {
            setDeleting(false);
            setAlertOpen(false);
            setDeleteId(null);
        }
    };

    const handleView = (row) => {
        setViewValue(row);
        setIsViewDialog(true);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialog(false);
        setViewValue("");
        setViewStatus(undefined);
    };

    const handleAddSubService = (serviceId) => {
        setSelectedServiceId(serviceId);
        setOpenSubCategoryDialog(true);
    };

    const handleEditService = (serviceRow) => {
        setEditService(serviceRow);
        setEditDialogOpen(true);
    };
    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setEditService(null);
    };

    const columns = serviceTableColumns({ handleToggleStatus, handleDelete, handleView, togglingIds, handleAddSubService, handleEdit: handleEditService });

    return (
        <Box className="p-1">
            <Header title="Create Service" />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
                <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px', width: { xs: '100%', sm: 'auto' }, }}>
                    <InputBase placeholder="Search Service" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
                    <IconButton type="button" sx={{ p: 1 }}>
                        <SearchOutlined />
                    </IconButton>
                </Box>
                <CustomIconButton icon={<PersonAdd />} text="Add New Service" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenCategory} sx={{ width: { xs: '100%', sm: 'auto' } }} />
            </Box>
            <CustomTable columns={columns} rows={filteredUsers} loading={loading} />

            <EntityDialog
                open={openCategoryDialog}
                handleClose={handleCloseCategoryDialog}
                dialogTitle="Add New Service"
                apiEndpoint="/service/admin/create"
                onSuccess={() => {
                    handleCloseCategoryDialog();
                    fetchAllServices();
                }}
                inputLabel="Service Name"
                buttonText="Add Service"
                showPriceFields={true}
            />
            <EntityDialog open={isViewDialog} handleClose={handleCloseViewDialog} isView={true} viewValue={viewValue} viewStatus={viewStatus} inputLabel="Service Name" showPriceFields={true} />
            <EntityDialog open={editDialogOpen} handleClose={handleCloseEditDialog} isEdit={true} editService={editService} onSuccess={() => { handleCloseEditDialog(); fetchAllServices(); }} />

            <CreateSubservices open={openSubCategoryDialog} handleClose={() => setOpenSubCategoryDialog(false)} serviceId={selectedServiceId} onSuccess={fetchAllServices} />

            <Alert
                open={alertOpen}
                title="Delete Service"
                description="Are you sure you want to delete this service? This action cannot be undone."
                onClose={deleting ? undefined : () => setAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                disableCancel={deleting}
            />
        </Box>
    );
};