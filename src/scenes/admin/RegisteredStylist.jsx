import {
  Box,
  Container,
  IconButton,
  InputBase,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { stylistUserTableColumns } from "../../custom/StylistUserTableColumns";
import StylistEntityDialog from "../../components/StylistEntityDialog";
import Alert from "../../custom/Alert";

export default function RegisteredStylist() {
  const [allUsers, setAllUsers] = useState([]);
  const [originalStylists, setOriginalStylists] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingIds, setTogglingIds] = useState({});
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedStylistDetails, setSelectedStylistDetails] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, loading: false });
  const [editMode, setEditMode] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      return Object.values(address).filter(Boolean).join(', ');
    }
    return 'N/A';
  };

  const fetchAllStylistUserDetials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stylist/admin/get-all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response?.data?.status === 200) {
        setOriginalStylists(response.data.data);
        const formattedData = response?.data?.data.map((stylist) => ({
          id: stylist._id,
          fullName: stylist.fullName || "N/A",
          email: stylist.email || "N/A",
          phone: stylist.phoneNumber || "N/A",
          role: stylist.role || "N/A",
          dob: stylist.dob ? new Date(stylist.dob).toLocaleDateString() : "N/A",
          gender: stylist.gender || "N/A",
          approved: stylist.isApproved ?? false,
          createdAt: new Date(stylist.createdAt).toLocaleDateString(),
          address: formatAddress(stylist.address),
        }));
        setAllUsers(formattedData);
        setFilteredUsers(formattedData);
      }
    } catch (error) {
      showErrorToast("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllStylistUserDetials();
    }
  }, [authToken]);

  const handleView = (row) => {
    const fullStylistDetails = originalStylists.find(s => s._id === row.id);
    if (fullStylistDetails) {
      fullStylistDetails.address = formatAddress(fullStylistDetails.address);
      setSelectedStylistDetails(fullStylistDetails);
      setEditMode(false);
      setIsDetailsDialogOpen(true);
    } else {
      showErrorToast("Stylist details not found");
    }
  };

  const handleToggleStatus = async (id) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await axios.patch(`${API_BASE_URL}/stylist/admin/toggle/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Toggle response:', response.data.data);
      showSuccessToast(response?.data?.message || "Stylist status updated!");
      await fetchAllStylistUserDetials();
    } catch (error) {
      console.log("Toggle error:", error);
      showErrorToast("An error occurred while toggling approval.");
    } finally {
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === "") {
      setFilteredUsers(allUsers);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/stylist/admin/search-stylist`, {
        params: { query: value },
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response?.data?.status === 200 && response?.data?.success) {
        const formattedData = (response?.data?.data || []).map((stylist) => ({
          id: stylist._id,
          fullName: stylist.fullName || "N/A",
          email: stylist.email || "N/A",
          phone: stylist.phoneNumber || "N/A",
          role: stylist.role || "N/A",
          dob: stylist.dob ? new Date(stylist.dob).toLocaleDateString() : "N/A",
          gender: stylist.gender || "N/A",
          approved: stylist.isApproved ?? false,
          createdAt: stylist.createdAt ? new Date(stylist.createdAt).toLocaleDateString() : "N/A",
          address: formatAddress(stylist.address),
        }));
        setFilteredUsers(formattedData);
      } else {
        setFilteredUsers([]);
      }
    } catch (error) {
      setFilteredUsers([]);
    }
  };

  const handleDelete = (id) => {
    setDeleteDialog({ open: true, id, loading: false });
  };

  const handleConfirmDelete = async () => {
    const id = deleteDialog.id;
    console.log("Deleting stylist with ID:", id);
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axios.delete(`${API_BASE_URL}/stylist/admin/delete-stylist/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.status === 200) {
        showSuccessToast(response?.data?.message || "Stylist deleted successfully");
        setAllUsers((prevList) => prevList.filter(user => user.id !== id));
        setFilteredUsers((prevList) => prevList.filter(user => user.id !== id));
      } else {
        showErrorToast("Failed to delete stylist.");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
    } finally {
      setDeleteDialog({ open: false, id: null, loading: false });
    }
  };

  const handleEdit = (stylist) => {
    const fullStylistDetails = originalStylists.find(s => s._id === stylist.id);
    if (fullStylistDetails) {
      setSelectedStylistDetails(fullStylistDetails);
      setEditMode(true);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleSaveStylist = async (updatedData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/stylist/profile/${selectedStylistDetails._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status === 200) {
        showSuccessToast("Stylist updated successfully!");
        fetchAllStylistUserDetials();
        setIsDetailsDialogOpen(false);
        setEditMode(false);
      } else {
        showErrorToast("Failed to update stylist");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while updating.");
    }
  };

  const columns = stylistUserTableColumns({ handleToggleStatus, handleDelete, handleView, handleEdit, togglingIds });

  return (
    <Box className="p-1">
      <Header title="All Registered Stylist" />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px' }}>
          <InputBase placeholder="Search user" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box>
      </Box>
      <CustomTable columns={columns} rows={filteredUsers} loading={loading} checkboxSelection />
      <StylistEntityDialog
        open={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        data={selectedStylistDetails}
        onSave={handleSaveStylist}
        editMode={editMode}
      />
      <Alert
        open={deleteDialog.open}
        title="Delete Stylist"
        description="Are you sure you want to delete this stylist?"
        onClose={() => setDeleteDialog({ open: false, id: null, loading: false })}
        onConfirm={handleConfirmDelete}
        loading={deleteDialog.loading}
      />
    </Box>
  );
};