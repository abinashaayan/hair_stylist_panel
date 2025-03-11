import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Divider from "@mui/material/Divider";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import { CustomIconButton } from "../custom/Button";

const AddCategory = ({ open, handleClose, addCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      showCustomMessage("Category name is required!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/category/admin/insert`, {
        name: categoryName,
      });

      if (response?.data?.status === 200) {
        showSuccessToast(response?.data?.message || "Category added successfully");
        addCategory(response);
        setCategoryName("");
        handleClose(); 
      } else {
        showErrorToast(response?.data?.message || "Failed to add category");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add New Category</DialogTitle>
      <Divider />
      <DialogContent>
        <Input
          placeholder="Write category name"
          type="text"
          height={50}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <CustomIconButton color="red" text="Cancel" onClick={handleClose} />
        <CustomIconButton
          loading={loading}
          disabled={loading}
          color="black"
          text="Add Category"
          onClick={handleAddCategory}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddCategory;
