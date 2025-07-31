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
import { ProductTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import ProductEntityDialog from "../../components/ProductEntityDialog";

export default function Product() {
  const [allServices, setAllServices] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedRows, setSelectedRows] = useState([]);
  const [multiDeleteOpen, setMultiDeleteOpen] = useState(false);
  const [multiDeleting, setMultiDeleting] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/product/admin/total-products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response?.data?.status === 200 && response?.data?.success) {
        const formattedData = (response?.data?.data || []).map((product) => ({
          id: product._id,
          name: product.name || "N/A",
          subtitle: product.subtitle || "N/A",
          about: product.about || "N/A",
          price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : "N/A",
          quickTips: product.quickTips || "N/A",
          stockQuantity: product.stockQuantity ?? 0,
          inStock: product.inStock ?? false,
          manufacturer: product.manufacturer || {},
          photos: Array.isArray(product.photos) ? product.photos : [],
          goodToKnow: (Array.isArray(product.goodToKnow) ? product.goodToKnow.join(", ") : product.goodToKnow) || "N/A",
          approved: true,
          category: product.category?.name || "N/A",
          createdAt: product.createdAt
            ? new Date(product.createdAt).toLocaleDateString()
            : "N/A",
        }));
        setAllServices(formattedData);
        setFilteredUsers(formattedData);
      } else {
        showErrorToast(response?.data?.message || "Failed to fetch products");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllProducts();
    }
  }, [authToken]);

  useEffect(() => {
    const filteredIds = filteredUsers.map((row) => row.id);
    const stillVisible = selectedRows.filter((id) => filteredIds.includes(id));
    if (stillVisible.length !== selectedRows.length) {
      setSelectedRows(stillVisible);
    }
    // if (searchText === "") {
    //   setFilteredUsers(allServices);
    // } else {
    //   setFilteredUsers(
    //     allServices.filter((service) =>
    //       service.name.toLowerCase().includes(searchText)
    //     )
    //   );
    // }
  }, [filteredUsers]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim() === "") {
      setFilteredUsers(allServices);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/product/search`, {
        params: { query: value },
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response?.data?.status === 200 && response?.data?.success) {
        const formattedData = (response?.data?.data || []).map((product) => ({
          id: product._id,
          name: product.name || "N/A",
          subtitle: product.subtitle || "N/A",
          about: product.about || "N/A",
          price: typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : "N/A",
          quickTips: product.quickTips || "N/A",
          stockQuantity: product.stockQuantity ?? 0,
          inStock: product.inStock ?? false,
          manufacturer: product.manufacturer || {},
          photos: Array.isArray(product.photos) ? product.photos : [],
          goodToKnow: (Array.isArray(product.goodToKnow) ? product.goodToKnow.join(", ") : product.goodToKnow) || "N/A",
          approved: true,
          category: product.category?.name || "N/A",
          createdAt: product.createdAt
            ? new Date(product.createdAt).toLocaleDateString()
            : "N/A",
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
    setSelectedProduct(row);
    setDialogMode('view');
    setOpenProductDialog(true);
  };

  const handleEdit = (row) => {
    setSelectedProduct(row);
    setDialogMode('edit');
    setOpenProductDialog(true);
  };

  const handleOpenProduct = () => {
    setSelectedProduct(null);
    setDialogMode('create');
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setSelectedProduct(null);
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

  const columns = ProductTableColumns({
    handleDelete,
    handleView,
    handleEdit
  });

  return (
    <Box className="p-1">
      <Header title="Products" subtitle="Managing products and inventory" />
      {/* <Container maxWidth={false}> */}
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
            <CustomIconButton icon={<PersonAdd />} text="Add New Product" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenProduct} />
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

        <ProductEntityDialog
          open={openProductDialog}
          handleClose={handleCloseProductDialog}
          onSuccess={fetchAllProducts}
          dialogTitle={dialogMode === 'create' ? "Add New Product" : dialogMode === 'edit' ? "Edit Product" : "View Product Details"}
          buttonText={dialogMode === 'create' ? "Add Product" : dialogMode === 'edit' ? "Update Product" : "Close"}
          mode={dialogMode}
          initialData={selectedProduct}
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
      {/* </Container> */}
    </Box>
  );
};