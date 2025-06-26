import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import Input from "../custom/Input";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import Divider from "@mui/material/Divider";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import { CustomIconButton } from "../custom/Button";
import { Close, PersonAdd } from "@mui/icons-material";

const EntityDialog = ({
  open,
  handleClose,
  dialogTitle = "Add New Category",
  apiEndpoint = "/category/admin/insert",
  fetchAll = () => { },
  inputLabel = "Category Name",
  buttonText = "Add Category",
  onSuccess = () => { },
  isEdit = false,
  editId = null,
  editValue = "",
  isView = false,
  viewValue = "",
  viewStatus = undefined,
  showPriceFields = false,
  editMaxPrice = "",
  editMinPrice = "",
  viewMaxPrice = "",
  viewMinPrice = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setInputValue("");
      setMaxPrice("");
      setMinPrice("");
    } else if (isEdit && editValue) {
      setInputValue(editValue);
      setMaxPrice(editMaxPrice || "");
      setMinPrice(editMinPrice || "");
    } else if (isView && viewValue) {
      setInputValue(viewValue);
      setMaxPrice(viewMaxPrice || "");
      setMinPrice(viewMinPrice || "");
    }
  }, [open, isEdit, editValue, editMaxPrice, editMinPrice, isView, viewValue, viewMaxPrice, viewMinPrice]);

  const handleAddOrUpdate = async () => {
    if (!inputValue.trim()) {
      showCustomMessage(`${inputLabel} is required!`);
      return;
    }
    
    if (showPriceFields) {
      if (!maxPrice.trim()) {
        showCustomMessage("Max Price is required!");
        return;
      }
      if (!minPrice.trim()) {
        showCustomMessage("Min Price is required!");
        return;
      }
      if (parseFloat(maxPrice) < parseFloat(minPrice)) {
        showCustomMessage("Max Price cannot be less than Min Price!");
        return;
      }
    }
    
    setLoading(true);
    try {
      const requestData = { name: inputValue };
      if (showPriceFields) {
        requestData.maxPrice = parseFloat(maxPrice);
        requestData.minPrice = parseFloat(minPrice);
      }
      
      if (isEdit && editId) {
        // PATCH update
        const response = await axios.patch(`${API_BASE_URL}/product-category/admin/update/${editId}`, requestData);
        if (response?.data?.status === 200) {
          showSuccessToast(response?.data?.message || `${inputLabel} updated successfully`);
          setInputValue("");
          setMaxPrice("");
          setMinPrice("");
          onSuccess();
        }
      } else {
        // POST create
        const response = await axios.post(`${API_BASE_URL}${apiEndpoint}`, requestData);
        if (response?.data?.status === 201) {
          showSuccessToast(response?.data?.message || `${inputLabel} added successfully`);
          setInputValue("");
          setMaxPrice("");
          setMinPrice("");
          onSuccess();
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setInputValue("");
    setMaxPrice("");
    setMinPrice("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle>
        <Typography variant="h5" className="fw-bold">
          {isView ? `View ${inputLabel}` : isEdit ? `Edit ${inputLabel}` : dialogTitle}
        </Typography>
      </DialogTitle>
      <Divider sx={{ borderBottomWidth: 1, borderColor: 'black' }} />
      <DialogContent>
        {isView ? (
          <>
            <Box sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} pb={1} borderBottom="1px solid #ccc">
                <InputLabel sx={{ color: "black", fontWeight: 500 }}>Name</InputLabel>
                <Typography sx={{ fontWeight: 500 }}>{viewValue || "N/A"}</Typography>
              </Box>
              {showPriceFields && (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} pb={1} borderBottom="1px solid #ccc">
                    <InputLabel sx={{ color: "black", fontWeight: 500 }}>Max Price</InputLabel>
                    <Typography sx={{ fontWeight: 500 }}>{viewMaxPrice || "N/A"}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} pb={1} borderBottom="1px solid #ccc">
                    <InputLabel sx={{ color: "black", fontWeight: 500 }}>Min Price</InputLabel>
                    <Typography sx={{ fontWeight: 500 }}>{viewMinPrice || "N/A"}</Typography>
                  </Box>
                </>
              )}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <InputLabel sx={{ color: "black", fontWeight: 500 }}>Status</InputLabel>
                <Chip
                  label={viewStatus !== undefined ? (viewStatus ? "Active" : "Inactive") : "N/A"}
                  variant="outlined"
                  sx={{
                    fontWeight: "bold",
                    minWidth: 80,
                    textAlign: "center",
                    color: "#fff",
                    backgroundColor: viewStatus === undefined ? "#9e9e9e" : viewStatus ? "#4caf50" : "#f44336", border: "none",
                  }}
                />
              </Box>
            </Box>
          </>
        ) : (
          <>
            <InputLabel sx={{ color: "black" }}>{inputLabel}</InputLabel>
            <Input
              placeholder={`Write ${inputLabel.toLowerCase()}`}
              type="text"
              height={50}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isView}
            />
            {showPriceFields && (
              <>
                <InputLabel sx={{ color: "black", mt: 2 }}>Max Price</InputLabel>
                <Input
                  placeholder="Enter max price"
                  type="number"
                  height={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  disabled={isView}
                />
                <InputLabel sx={{ color: "black", mt: 2 }}>Min Price</InputLabel>
                <Input
                  placeholder="Enter min price"
                  type="number"
                  height={50}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  disabled={isView}
                />
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleDialogClose} />
        <CustomIconButton
          icon={<PersonAdd />}
          loading={loading}
          disabled={loading || isView}
          color="black"
          text={isEdit ? "Update" : buttonText}
          onClick={handleAddOrUpdate}
        />
      </DialogActions>
    </Dialog>
  );
};

export default EntityDialog;
