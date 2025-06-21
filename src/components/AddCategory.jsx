import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Divider from "@mui/material/Divider";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import { CustomIconButton } from "../custom/Button";
import { Close, PersonAdd } from "@mui/icons-material";

const AddCategory = ({ open, handleClose, categoryName, setCategoryName, fetchAllCategoryDetails, showCategoryDetails }) => {
  const [loading, setLoading] = useState(false);
  const isViewMode = Boolean(showCategoryDetails);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      showCustomMessage("Category name is required!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/category/admin/insert`,
        { name: categoryName }
      );
      if (response?.data?.status === 200) {
        showSuccessToast(
          response?.data?.message || "Category added successfully"
        );
        await fetchAllCategoryDetails();
        handleClose();
        setCategoryName("");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography variant="h5" className="fw-bold">
          {isViewMode ? "Category Details" : "Add New Category"}
        </Typography>
      </DialogTitle>
      <Divider sx={{ borderBottomWidth: 1, borderColor: 'black' }} />
      <DialogContent>
        {isViewMode ? (
          <>
            <Typography variant="h6">{showCategoryDetails?.name}</Typography>
            <Typography variant="body2">
              ID: {showCategoryDetails?.categoryId}
            </Typography>
            <Typography variant="body2">
              Slug: {showCategoryDetails?.slug}
            </Typography>
            <Typography variant="body2">
              Status: {showCategoryDetails?.isActive}
            </Typography>
            <Typography variant="body2">
              Created At: {showCategoryDetails?.createdAt}
            </Typography>
          </>
        ) : (
          <>
            <InputLabel sx={{ color: "black" }}>Category Name</InputLabel>
            <Input
              placeholder="Write category name"
              type="text"
              height={50}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleClose} />
        {!isViewMode && (
          <CustomIconButton
            icon={<PersonAdd />}
            loading={loading}
            disabled={loading}
            color="black"
            text="Add Category"
            onClick={handleAddCategory}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddCategory;
