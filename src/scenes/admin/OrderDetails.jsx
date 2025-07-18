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
import { SearchOutlined, PersonAdd, Delete as DeleteIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { orderDetailsTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import OrderDetailsEntityDialog from "../../components/OrderDetailsEntityDialog";

export default function OrderDetails() {
  // Static data for order details
  const staticOrders = [
    {
      id: "1",
      name: "Shampoo & Cut",
      subtitle: "Basic hair wash and cut",
      about: "A simple shampoo and haircut service.",
      price: "$25.00",
      quickTips: "Arrive 10 minutes early",
      stockQuantity: 10,
      inStock: true,
      manufacturer: { name: "SalonPro" },
      photos: [],
      goodToKnow: "No appointment needed",
      approved: true,
      category: "Hair Care",
      createdAt: new Date().toLocaleDateString(),
    },
    {
      id: "2",
      name: "Color Treatment",
      subtitle: "Full hair coloring",
      about: "Professional hair coloring with premium products.",
      price: "$60.00",
      quickTips: "Consult stylist for color options",
      stockQuantity: 5,
      inStock: true,
      manufacturer: { name: "ColorX" },
      photos: [],
      goodToKnow: "Patch test recommended",
      approved: true,
      category: "Coloring",
      createdAt: new Date().toLocaleDateString(),
    },
    {
      id: "3",
      name: "Beard Trim",
      subtitle: "Beard shaping and trim",
      about: "Expert beard trimming and shaping.",
      price: "$15.00",
      quickTips: "Clean beard before appointment",
      stockQuantity: 8,
      inStock: true,
      manufacturer: { name: "BeardMaster" },
      photos: [],
      goodToKnow: "Walk-ins welcome",
      approved: true,
      category: "Grooming",
      createdAt: new Date().toLocaleDateString(),
    },
  ];

  const [allServices, setAllServices] = useState(staticOrders);
  const [filteredUsers, setFilteredUsers] = useState(staticOrders);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [multiDeleteOpen, setMultiDeleteOpen] = useState(false);
  const [multiDeleting, setMultiDeleting] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  // Remove fetchAllProducts and useEffect for fetching
  // Remove handleSearch API call, just filter static data
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === "") {
      setFilteredUsers(allServices);
      return;
    }
    const filtered = allServices.filter(
      (service) =>
        service.name.toLowerCase().includes(value.toLowerCase()) ||
        service.subtitle.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/product/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.success) {
        showSuccessToast(response?.data?.message || "Product deleted successfully");
        setAllServices((prevProducts) => prevProducts.filter((product) => product.id !== deleteId));
        setFilteredUsers((prevProducts) => prevProducts.filter((product) => product.id !== deleteId));
      } else {
        showErrorToast(response?.data?.message || "Failed to delete product");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting");
    } finally {
      setDeleting(false);
      setAlertOpen(false);
      setDeleteId(null);
    }
  };

  const handleView = (row) => {
    setSelectedOrder(row);
    setOpenOrderDialog(true);
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
    setSelectedOrder(null);
  };

  const handleSelectionModelChange = (ids) => {
    const selected = Array.isArray(ids) ? ids : Array.from(ids || []);
    setSelectedRows(selected);
  };

  const handleMultiDelete = () => {
    setMultiDeleteOpen(true);
  };

  const handleConfirmMultiDelete = async () => {
    if (!selectedRows.length) return;
    setMultiDeleting(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/product/delete`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        data: { productsIds: selectedRows },
      });
      if (response?.data?.success) {
        showSuccessToast(response?.data?.message || "Products deleted successfully");
        setAllServices((prev) => prev.filter((product) => !selectedRows.includes(product.id)));
        setFilteredUsers((prev) => prev.filter((product) => !selectedRows.includes(product.id)));
        setSelectedRows([]);
      } else {
        showErrorToast(response?.data?.message || "Failed to delete products");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting");
    } finally {
      setMultiDeleting(false);
      setMultiDeleteOpen(false);
    }
  };

  const columns = orderDetailsTableColumns({
    handleDelete,
    handleView
  });

  return (
    <Box className="p-1">
      <Header title="Products" subtitle="Managing products and inventory" />
      <Container maxWidth={false}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, mt: 3 }}>
          <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px' }}>
            <InputBase placeholder="Search Product name or subtitle" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {selectedRows.length >= 1 && (
              <CustomIconButton
                icon={<DeleteIcon />}
                text={selectedRows.length === 1 ? "Delete" : `Delete (${selectedRows.length})`}
                color="#d32f2f"
                variant="outlined"
                onClick={() => {
                  if (selectedRows.length === 1) {
                    handleDelete(selectedRows[0]);
                  } else {
                    handleMultiDelete();
                  }
                }}
                fontWeight="bold"
              />
            )}
          </Box>
        </Box>

        <CustomTable
          rows={filteredUsers}
          columns={columns}
          loading={loading}
          checkboxSelection
          noRowsMessage="No products found"
          onSelectionModelChange={handleSelectionModelChange}
          selectionModel={selectedRows}
        />

        <OrderDetailsEntityDialog
          open={openOrderDialog}
          handleClose={handleCloseOrderDialog}
          initialData={selectedOrder}
        />

        <Alert
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          onConfirm={handleConfirmDelete}
          loading={deleting}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
        />
        <Alert
          open={multiDeleteOpen}
          onClose={() => setMultiDeleteOpen(false)}
          onConfirm={handleConfirmMultiDelete}
          loading={multiDeleting}
          title="Delete Products"
          description={`Are you sure you want to delete these ${selectedRows.length} products? This action cannot be undone.`}
        />
      </Container>
    </Box>
  );
};