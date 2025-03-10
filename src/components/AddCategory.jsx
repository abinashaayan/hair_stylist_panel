import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useState } from "react";

const AddCategory = ({ open, handleClose, addCategory }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = () => {
    if (categoryName.trim() === "") return;
    
    addCategory(categoryName); // Add category in local state
    setCategoryName(""); // Reset input field
    handleClose(); // Close dialog
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <TextField
          label="Category Name"
          fullWidth
          margin="normal"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleAddCategory} variant="contained" color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategory;
