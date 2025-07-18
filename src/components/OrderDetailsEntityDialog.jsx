import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";

export default function OrderDetailsEntityDialog({ open, handleClose, initialData }) {
  if (!initialData) return null;
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6">{initialData.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{initialData.subtitle}</Typography>
          <Typography variant="body1" gutterBottom>{initialData.about}</Typography>
          <Typography><b>Price:</b> {initialData.price}</Typography>
          <Typography><b>Quick Tips:</b> {initialData.quickTips}</Typography>
          <Typography><b>Stock Quantity:</b> {initialData.stockQuantity}</Typography>
          <Typography><b>In Stock:</b> {initialData.inStock ? "Yes" : "No"}</Typography>
          <Typography><b>Manufacturer:</b> {initialData.manufacturer?.name || "N/A"}</Typography>
          <Typography><b>Good To Know:</b> {initialData.goodToKnow}</Typography>
          <Typography><b>Category:</b> {initialData.category}</Typography>
          <Typography><b>Created At:</b> {initialData.createdAt}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
