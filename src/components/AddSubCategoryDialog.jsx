import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const AddSubCategoryDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Sub Category</DialogTitle>
      <DialogContent>
        <TextField 
          autoFocus
          margin="dense"
          label="Sub Category Name"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={handleClose} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubCategoryDialog;
