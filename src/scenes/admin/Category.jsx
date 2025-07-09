import {
    Box,
    Container,
    IconButton,
    InputBase,
    Button,
    useTheme,
    Typography,
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, PersonAdd } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import EntityDialog from "../../components/EntityDialog";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { productCategoryTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";

export default function Category() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [togglingIds, setTogglingIds] = useState({});
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [isEditDialog, setIsEditDialog] = useState(false);
    const [isViewDialog, setIsViewDialog] = useState(false);
    const [viewValue, setViewValue] = useState("");
    const [viewStatus, setViewStatus] = useState(undefined);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const authToken = Cookies.get("token");

    const fetchAllProductCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product-category/admin/get-all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response?.data?.status === 200) {
                const formattedData = response?.data?.data.map((category) => ({
                    id: category._id,
                    productName: category.name || "N/A",
                    approved: category.isActive ?? false,
                    createdAt: new Date(category.createdAt).toLocaleDateString(),
                }));

                setAllUsers(formattedData);
            }
        } catch (error) {
            showErrorToast("Error fetching product categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchAllProductCategories();
        }
    }, [authToken]);

    useEffect(() => {
        if (searchText === "") {
            setFilteredUsers(allUsers);
        } else {
            setFilteredUsers(
                allUsers.filter((user) =>
                    user.productName.toLowerCase().includes(searchText)
                )
            );
        }
    }, [allUsers, searchText]);

    const handleToggleStatus = async (id) => {
        setTogglingIds((prev) => ({ ...prev, [id]: true }));
        try {
            const response = await axios.patch(`${API_BASE_URL}/product-category/admin/toggle/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            console.log('Toggle response:', response.data.data);
            showSuccessToast(response?.data?.message || "Stylist status updated!");
            await fetchAllProductCategories();
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
            const response = await axios.delete(`${API_BASE_URL}/product-category/admin/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.data?.status === 200) {
                showSuccessToast(response?.data?.message || "Category deleted successfully");
                setAllUsers((prevList) => prevList.filter(category => category.id !== deleteId));
                setFilteredUsers((prevList) => prevList.filter(category => category.id !== deleteId));
            } else {
                showErrorToast("Failed to delete category.");
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
        setViewValue(row.productName);
        setViewStatus(row.approved);
        setIsViewDialog(true);
    };

    const handleEdit = (row) => {
        setEditId(row.id);
        setEditValue(row.productName);
        setIsEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialog(false);
        setEditId(null);
        setEditValue("");
    };

    const handleCloseViewDialog = () => {
        setIsViewDialog(false);
        setViewValue("");
        setViewStatus(undefined);
    };

    const columns = productCategoryTableColumns({ handleToggleStatus, handleDelete, handleView, togglingIds, handleEdit });

    return (
        <Box className="p-1 mt-4">
            <Container maxWidth={false}>
                <Header title="Category" />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px' }}>
                        <InputBase placeholder="Search Category" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                    <CustomIconButton icon={<PersonAdd />} text="Add Category" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenCategory} />
                </Box>
                <CustomTable columns={columns} rows={filteredUsers} loading={loading} checkboxSelection />
            </Container>
            <EntityDialog
                open={openCategoryDialog}
                handleClose={handleCloseCategoryDialog}
                dialogTitle="Add New Category"
                apiEndpoint="/product-category/admin/create"
                onSuccess={() => {
                    handleCloseCategoryDialog();
                    fetchAllProductCategories();
                }}
                inputLabel="Category Name"
                buttonText="Add Category"
            />
            <EntityDialog
                open={isEditDialog}
                handleClose={handleCloseEditDialog}
                isEdit={true}
                editId={editId}
                editValue={editValue}
                inputLabel="Category Name"
                onSuccess={() => {
                    handleCloseEditDialog();
                    fetchAllProductCategories();
                }}
            />
            <EntityDialog
                open={isViewDialog}
                handleClose={handleCloseViewDialog}
                isView={true}
                viewValue={viewValue}
                viewStatus={viewStatus}
                inputLabel="Category Name"
            />
            <Alert
                open={alertOpen}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                onClose={deleting ? undefined : () => setAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                disableCancel={deleting}
            />
        </Box>
    );
};