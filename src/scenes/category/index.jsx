import {
  Box, Container, IconButton, InputBase, Button, useTheme
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
  const [categories, setCategories] = useState([{ id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Books" }]);

  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(categories);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleOpenCategory = () => {
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };

  const addNewCategory = (categoryName) => {
    const newCategory = { id: categories.length + 1, name: categoryName };
    setCategories([...categories, newCategory]);
    setFilteredUsers([...categories, newCategory]);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (value === "") {
      setFilteredUsers(categories);
    } else {
      const filtered = categories.filter(user =>
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
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    console.log("Deleting category:", id);
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    setFilteredUsers(updatedCategories);
  };

  const handleView = (id) => {
    console.log("Viewing category:", id);
  };


  const columns = categoryTableColumns({ handleAddSubCategory, handleDelete, handleView });


  return (
    <Container maxWidth={false}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Header title="Category" />
        <Box display="flex" alignItems="center" ml={2} gap={2}>
          <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} borderRadius="3px">
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
              color: "white",
              "&:hover": {
                backgroundColor: colors.primary[600],
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
      <CustomTable columns={columns} rows={filteredUsers} checkboxSelection />
      <AddSubCategoryDialog open={openDialog} handleClose={handleCloseDialog} />
      <AddCategory open={openCategoryDialog} handleClose={handleCloseCategoryDialog} addCategory={addNewCategory} />
    </Container>
  );
};

export default Category;
