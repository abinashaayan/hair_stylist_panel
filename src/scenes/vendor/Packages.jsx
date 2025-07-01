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
import { packageTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import PackageEntityDialog from '../../components/PackageEntityDialog';

export default function Packages() {
  const [allServices, setAllServices] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isViewDialog, setIsViewDialog] = useState(false);
  const [openPackageDialog, setOpenPackageDialog] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchAllPackage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/package/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response?.data?.status === 200 && response?.data?.success) {
        const fullData = (response?.data?.data || []).map((item) => ({ ...item, id: item._id }));
        setAllServices(fullData);
      } else {
        showErrorToast(response?.data?.message || "Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      showErrorToast("Error fetching packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllPackage();
    }
  }, [authToken]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredUsers(allServices);
    } else {
      setFilteredUsers(
        allServices.filter((pkg) =>
          (pkg.title || pkg.name || "").toLowerCase().includes(searchText)
        )
      );
    }
  }, [allServices, searchText]);

  const handleOpenCategory = () => {
    setEditRow(null);
    setEditMode(false);
    setOpenPackageDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenPackageDialog(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const handleDelete = (id) => {
     console.log("Delete ID:", id);
    setDeleteId(id);
    setAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/package/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
          console.log("Delete ID:", response);
      if (response?.data?.status === 200) {
        showSuccessToast(response?.data?.message || "Package deleted successfully");
        setAllServices((prevServices) => prevServices.filter((service) => service.id !== deleteId));
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteId));
        await fetchAllPackage();
      } else {
        showErrorToast("Failed to delete package.");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
    } finally {
      setDeleting(false);
      setAlertOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setEditMode(true);
    setOpenPackageDialog(true);
  };

  const handleView = (row) => {
    setViewRow(row);
    setIsViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialog(false);
    setViewRow(null);
  };

  const columns = packageTableColumns({ handleDelete, handleView, handleEdit });

  return (
    <Box className="p-1">
      <Container maxWidth={false}>
        <Header title="Create Package" />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
          <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px', width: { xs: '100%', sm: 'auto' }, }}>
            <InputBase placeholder="Search Package" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
          <CustomIconButton icon={<PersonAdd />} text="Add New Package" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenCategory} sx={{ width: { xs: '100%', sm: 'auto' } }} />
        </Box>
        <CustomTable columns={columns} rows={filteredUsers} loading={loading} noRowsMessage="No products found" />
      </Container>

      <PackageEntityDialog
        open={openPackageDialog}
        handleClose={() => {
          setOpenPackageDialog(false);
          setEditMode(false);
          setEditRow(null);
        }}
        onSuccess={() => {
          setOpenPackageDialog(false);
          setEditMode(false);
          setEditRow(null);
          fetchAllPackage();
        }}
        editMode={editMode}
        rowData={editRow}
      />
      <PackageEntityDialog
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