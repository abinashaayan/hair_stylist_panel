import {
  Box,
  Container,
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
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { serviceManagementTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import ServiceManagementEntityDialog from '../../components/ServiceManagementEntityDialog';

export default function ServiceManagement() {
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
  const [viewRow, setViewRow] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchAllServiceManagement = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/stylist/get-services`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response?.data?.status === 200 && response?.data?.success) {
        const formattedData = response?.data?.data?.map((item, index) => ({
          id: item.subService?._id, 
          serviceName: item.service?.name || 'N/A',
          subServiceName: item.subService?.name || 'N/A',
          price: item.price ?? 'N/A',
          duration: item.duration ?? 'N/A',
          approved: !!item.isActive,
          createdAt: item.service?.createdAt
            ? new Date(item.service.createdAt).toLocaleDateString()
            : 'N/A',
        }));
        setAllServices(formattedData);
      } else {
        showErrorToast(response?.data?.message || "Failed to fetch services");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      showErrorToast("Error fetching services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllServiceManagement();
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
    console.log("Toggling status for ID:", id);
    setTogglingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await axios.patch(`${API_BASE_URL}/stylist/toggle/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Toggle response:', response.data.data);
      showSuccessToast(response?.data?.message || "Service status updated!");
      await fetchAllServiceManagement();
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
    setViewRow(row);
    setIsViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialog(false);
    setViewRow(null);
  };

  const columns = serviceManagementTableColumns({ handleToggleStatus, handleDelete, handleView, togglingIds });

  return (
    <Box className="p-1">
      <Container maxWidth={false}>
        <Header title="Create Sub Service" />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
          <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px', width: { xs: '100%', sm: 'auto' }, }}>
            <InputBase placeholder="Search Service" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
          <CustomIconButton icon={<PersonAdd />} text="Add New SUb Service" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenCategory} sx={{ width: { xs: '100%', sm: 'auto' } }} />
        </Box>
        <CustomTable columns={columns} rows={filteredUsers || []} loading={loading} checkboxSelection />
      </Container>

      <ServiceManagementEntityDialog
        open={openCategoryDialog}
        handleClose={handleCloseCategoryDialog}
        onSuccess={() => {
          handleCloseCategoryDialog();
          fetchAllServiceManagement();
        }}
      />
      <ServiceManagementEntityDialog
        open={isViewDialog}
        handleClose={handleCloseViewDialog}
        viewMode={true}
        rowData={viewRow}
      />
      <Alert
        open={alertOpen}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        onClose={() => setAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        disableCancel={deleting}
      />
    </Box>
  );
};