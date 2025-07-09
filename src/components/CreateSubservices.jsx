import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { Close, PersonAdd } from "@mui/icons-material";
import { CustomIconButton } from "../custom/Button";

const AddSubCategoryDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Sub Services</DialogTitle>
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
        <CustomIconButton icon={<Close />} color="red" text="Close" />
        <CustomIconButton icon={<PersonAdd />} color="black" text="Add" />
      </DialogActions>
    </Dialog>
  );
};

export default AddSubCategoryDialog;
