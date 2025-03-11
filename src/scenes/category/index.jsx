import {
  Box,
  Container,
  IconButton,
  InputBase,
  Button,
  useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, PersonAdd, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { categoryTableColumns } from "../../custom/categoryTableColumns";
import { API_BASE_URL } from "../../utils/apiConfig";
import AddSubCategoryDialog from "../../components/AddSubCategoryDialog";
import AddCategory from "../../components/AddCategory";
import { tokens } from "../../theme";

const Category = () => {
  const [allCategoriesList, setAllCategoriesList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fetchAllCategoryDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/category/admin/get-categories`
      );
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((category) => ({
          id: category._id,
          categoryId: category.categoryId || "N/A",
          name: category.name.en || "N/A",
          slug: category.slug || "N/A",
          isActive: category.isActive ? "Active" : "Inactive",
          createdAt: new Date(category.createdAt).toLocaleDateString(),
        }));
        setAllCategoriesList(formattedData);
        setFilteredUsers(formattedData);
      } else {
        showErrorToast("Failed to fetch categories");
      }
    } catch (error) {
      showErrorToast("Error fetching categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
console.log(openCategoryDialog, 'openCategoryDialog')
  useEffect(() => {
    fetchAllCategoryDetails();
  }, []);

  const handleOpenCategory = () => {
    setOpenCategoryDialog(true);
  };
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false); 
  };

  const addNewCategory = (newCategoryData) => {
    if (!newCategoryData || !newCategoryData.data) return;

    const newCategory = {
      id: newCategoryData.data._id,
      categoryId: newCategoryData.data.categoryId || "N/A",
      name: newCategoryData.data.name.en || "N/A",
      slug: newCategoryData.data.slug || "N/A",
      isActive: newCategoryData.data.isActive ? "Active" : "Inactive",
      createdAt: new Date(newCategoryData.data.createdAt).toLocaleDateString(),
    };

    setAllCategoriesList((prev) => [...prev, newCategory]);
    setFilteredUsers((prev) => [...prev, newCategory]);

    handleCloseCategoryDialog(); 
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (value === "") {
      setFilteredUsers(allCategoriesList);
    } else {
      const filtered = allCategoriesList.filter(
        (user) =>
          (user.lastName && user.lastName.toLowerCase().includes(value)) ||
          (user.firstName && user.firstName.toLowerCase().includes(value))
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAddSubCategory = (id) => {
    console.log("Adding subcategory for:", id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setTimeout(() => {
      setOpenDialog(false);
    }, 300);
  };

  const handleDelete = (id) => {
    console.log("Deleting category:", id);
    const updatedCategories = allCategoriesList.filter(
      (category) => category.id !== id
    );
    setAllCategoriesList(updatedCategories); 
    setFilteredUsers(updatedCategories);
  };

  const handleView = (id) => {
    console.log("Viewing category:", id);
  };

  const columns = categoryTableColumns({
    handleAddSubCategory,
    handleDelete,
    handleView,
  });

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Header title="Category" />
        <Box display="flex" alignItems="center" ml={2} gap={2}>
          <Box
            display="flex"
            alignItems="center"
            bgcolor={colors.primary[400]}
            borderRadius="3px"
          >
            <InputBase
              placeholder="Search category"
              value={searchText}
              onChange={handleSearch}
              sx={{ ml: 2, flex: 1 }}
            />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchOutlined />
            </IconButton>
          </Box>
          <Button
            variant="outlined"
            sx={{
              fontWeight: "bold",
              transition: ".3s ease",
              textTransform: "none",
              backgroundColor: colors.primary[400],
              color: "black",
              "&:hover": {
                backgroundColor: colors.primary[600],
                color: "white",
              },
            }}
            startIcon={<PersonAdd />}
            size="large"
            onClick={handleOpenCategory}
          >
            Add Category
          </Button>
        </Box>
      </Box>
      <CustomTable
        columns={columns}
        rows={filteredUsers}
        loading={loading}
        checkboxSelection
      />
      <AddSubCategoryDialog open={openDialog} handleClose={handleCloseDialog} />
      <AddCategory
        open={openCategoryDialog}
        handleClose={handleCloseCategoryDialog}
        addCategory={addNewCategory}
      />
    </Container>
  );
};

export default Category;
