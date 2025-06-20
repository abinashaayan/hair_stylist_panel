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
import AddSubCategoryDialog from "../../components/AddSubCategoryDialog";
import AddCategory from "../../components/AddCategory";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { stylistUserTableColumns } from "../../custom/StylistUserTableColumns";

const Category = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingIds, setTogglingIds] = useState({});

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchAllStylistUserDetials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stylist/admin/get-all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response?.data?.status === 200) {
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
        }));
        setAllUsers(formattedData); // ✅ Set both states
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
      // After successful toggle, re-fetch the stylist user details
      await fetchAllStylistUserDetials();
    } catch (error) {
      console.log("Toggle error:", error);
      showErrorToast("An error occurred while toggling approval.");
    } finally {
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    if (value === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.fullName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.mobile.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    }
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/category/admin/delete-category/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.status === 200) {
        showSuccessToast(response?.data?.message || "Category deleted successfully");
        setAllCategoriesList((prevList) => prevList.filter(category => category.id !== id));
        setFilteredUsers((prevList) => prevList.filter(category => category.id !== id));

      } else {
        showErrorToast("Failed to delete category.");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
    }
  };

  const handleView = (row) => {
    setOpenCategoryDialog(true);
  };

  const columns = stylistUserTableColumns({ handleToggleStatus, handleDelete, handleView, togglingIds });

  return (
    <Box className="p-1 mt-4">
      <Container maxWidth={false}>
        <Header title="Stylist Users" />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px' }}>
            <InputBase placeholder="Search user" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
        </Box>
        <CustomTable columns={columns} rows={filteredUsers} loading={loading} checkboxSelection />
      </Container>
    </Box>
  );
};

export default Category;
