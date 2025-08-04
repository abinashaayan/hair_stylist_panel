import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  InputLabel,
} from "@mui/material";
import Input from "../custom/Input";
import { CustomIconButton } from "../custom/Button";
import { Close, PersonAdd, Edit } from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import { showErrorToast, showSuccessToast, showCustomMessage } from "../Toast";
import Cookies from "js-cookie";

const initialManufacturer = { name: "", address: "", contact: "" };

const ProductEntityDialog = ({
  open,
  handleClose,
  onSuccess = () => { },
  dialogTitle = "Add New Product",
  buttonText = "Add Product",
  mode = 'create',
  initialData = null,
}) => {
  const [fields, setFields] = useState({
    name: "",
    subtitle: "",
    about: "",
    price: "",
    stockQuantity: "",
    goodToKnow: "",
    quickTips: "",
    discount: "",
    validityInDays: "",
    isFlashSale: false,
    flashSaleStart: "",
  });
  const [manufacturer, setManufacturer] = useState(initialManufacturer);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'view')) {
      setFields({
        name: initialData.name || "",
        subtitle: initialData.subtitle || "",
        about: initialData.about || "",
        price: initialData.price?.toString().replace('$', '') || "",
        stockQuantity: initialData.stockQuantity?.toString() || "",
        goodToKnow: Array.isArray(initialData.goodToKnow) ? initialData.goodToKnow.join(", ") : initialData.goodToKnow || "",
        quickTips: initialData.quickTips || "",
        discount: initialData.discount ? initialData.discount.toString().replace('%', '') : "",
        validityInDays: initialData.validityInDays?.toString() || "",
        isFlashSale: initialData.isFlashSale || false,
        flashSaleStart: initialData.flashSaleStart
          ? new Date(initialData.flashSaleStart).toISOString().split('T')[0]
          : "",
      });
      setManufacturer({
        name: initialData.manufacturer?.name || "",
        address: initialData.manufacturer?.address || "",
        contact: initialData.manufacturer?.contact || "",
      });
      if (initialData.photos && initialData.photos.length > 0) {
        setImageUrls(initialData.photos);
      } else {
        setImageUrls([]);
      }
      setFiles([]);
    }
  }, [initialData, mode]);

  const handleFieldChange = (e) => {
    if (mode === 'view') return;
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleManufacturerChange = (e) => {
    if (mode === 'view') return;
    setManufacturer({ ...manufacturer, [e.target.name]: e.target.value });
    if (e.target.name === "contact") {
      const value = e.target.value;
      if (value && !/^\d{0,10}$/.test(value)) {
        setContactError("Contact must be digits only and up to 10 digits");
      } else if (value.length > 0 && value.length !== 10) {
        setContactError("Contact must be exactly 10 digits");
      } else {
        setContactError("");
      }
    }
  };

  const handleFileChange = (e) => {
    if (mode === 'view') return;
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    // Preview
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setImageUrls(previews);
  };

  const handleDialogClose = () => {
    setFields({
      name: "",
      subtitle: "",
      about: "",
      price: "",
      stockQuantity: "",
      goodToKnow: "",
      quickTips: "",
    });
    setManufacturer(initialManufacturer);
    setFiles([]);
    setImageUrls([]);
    setLoading(false);
    handleClose();
  };

  const handleSubmit = async () => {
    if (mode === 'view') {
      handleDialogClose();
      return;
    }
    if (!(fields.name || "").trim()) return showCustomMessage("Product name is required!");
    if (!(fields.price || "").trim()) return showCustomMessage("Price is required!");
    if (!(fields.stockQuantity || "").trim()) return showCustomMessage("Stock quantity is required!");
    if (!(manufacturer.name || "").trim()) return showCustomMessage("Manufacturer name is required!");
    if (!(manufacturer.contact || "").trim() || !/^\d{10}$/.test(manufacturer.contact || "")) return showCustomMessage("Contact must be exactly 10 digits!");
    if (files.length === 0 && mode === 'create') return showCustomMessage("Product image is required!");

    setLoading(true);
    try {
      const token = Cookies.get("token");
      let response;
      if (mode === 'edit') {
        const url = `${API_BASE_URL}/product/update/${initialData.id}`;
        if (files.length > 0) {
          // If files are being uploaded, use FormData
          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
          formData.append("manufacturer[name]", manufacturer.name);
          formData.append("manufacturer[address]", manufacturer.address);
          formData.append("manufacturer[contact]", manufacturer.contact);
          files.forEach(file => formData.append("files", file));
          response = await axios.patch(
            url,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // No files, send JSON body
          const data = {
            ...fields,
            manufacturer: { ...manufacturer },
          };
          response = await axios.patch(
            url,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } else {
        // create mode (unchanged)
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
        formData.append("manufacturer[name]", manufacturer.name);
        formData.append("manufacturer[address]", manufacturer.address);
        formData.append("manufacturer[contact]", manufacturer.contact);
        files.forEach(file => formData.append("files", file));
        const url = `${API_BASE_URL}/product/create`;
        response = await axios.post(
          url,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response?.data?.success) {
        showSuccessToast(response?.data?.message || `Product ${mode === 'edit' ? 'updated' : 'created'} successfully`);
        handleDialogClose();
        onSuccess();
      } else {
        showErrorToast(response?.data?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} product`);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h5" className="fw-bold">
          {dialogTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
          {mode === 'view' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Product Name:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{fields?.name || 'N/A'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Subtitle:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{fields?.subtitle || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">About:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{fields?.about || 'N/A'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Price:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>${fields?.price || '0.00'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Stock Quantity:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{fields?.stockQuantity || '0'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Good To Know:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{fields?.goodToKnow || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Quick Tips:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{fields?.quickTips || 'N/A'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Product Images:</Typography>
                  {imageUrls.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                      {imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Product Preview ${idx + 1}`}
                          style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', borderRadius: 8 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ mb: 1.5 }}>N/A</Typography>
                  )}
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>Manufacturer Details</Typography>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Name:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{manufacturer.name || 'N/A'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Address:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{manufacturer.address || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Contact:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{manufacturer.contact || 'N/A'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Discount:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{initialData?.discount ?? 'N/A'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Validity (in days):</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{initialData?.validityInDays ?? 'N/A'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Is Flash Sale:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>{initialData?.isFlashSale ? 'Yes' : 'No'}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Flash Sale Period:</Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    {initialData?.flashSaleStart
                      ? new Date(initialData?.flashSaleStart).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Product Name</InputLabel>
                <Input name="name" value={fields.name} onChange={handleFieldChange} placeholder="Enter product name" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Subtitle</InputLabel>
                <Input name="subtitle" value={fields?.subtitle} onChange={handleFieldChange} placeholder="Enter subtitle" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Quick Tips</InputLabel>
                <Input name="quickTips" value={fields?.quickTips} onChange={handleFieldChange} placeholder="Quick tips" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Price</InputLabel>
                <Input name="price" value={fields?.price} onChange={handleFieldChange} placeholder="Enter price" type="number" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Stock Quantity</InputLabel>
                <Input name="stockQuantity" value={fields?.stockQuantity} onChange={handleFieldChange} placeholder="Enter stock quantity" type="number" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Good To Know</InputLabel>
                <Input name="goodToKnow" value={fields?.goodToKnow} onChange={handleFieldChange} placeholder="Good to know" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>About</InputLabel>
                <Input name="about" value={fields?.about} onChange={handleFieldChange} placeholder="About product" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 100%", mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Manufacturer Details</Typography>
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Name</InputLabel>
                <Input name="name" value={manufacturer?.name} onChange={handleManufacturerChange} placeholder="Manufacturer name" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Address</InputLabel>
                <Input name="address" value={manufacturer?.address} onChange={handleManufacturerChange} placeholder="Manufacturer address" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 30%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Contact</InputLabel>
                <Input name="contact" value={manufacturer?.contact} onChange={handleManufacturerChange} placeholder="Manufacturer contact" fullWidth />
                {contactError && (
                  <Typography color="error" variant="caption">{contactError}</Typography>
                )}
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Discount (%)</InputLabel>
                <Input name="discount" value={fields?.discount} onChange={handleFieldChange} placeholder="Enter discount" type="number" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Validity (in days)</InputLabel>
                <Input name="validityInDays" value={fields?.validityInDays} onChange={handleFieldChange} placeholder="Validity period" type="number" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <InputLabel sx={{ mb: 0.5 }}>Flash Sale Start Date</InputLabel>
                <Input name="flashSaleStart" value={fields?.flashSaleStart} onChange={handleFieldChange} type="date" fullWidth />
              </Box>
              <Box sx={{ flex: "1 1 45%", display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <InputLabel>Is Flash Sale?</InputLabel>
                <input type="checkbox" name="isFlashSale" checked={fields?.isFlashSale} onChange={(e) => setFields({ ...fields, isFlashSale: e.target.checked })} />
              </Box>

            </Box>
          )}
          {mode !== 'view' && (
            <>
              <InputLabel sx={{ mt: 2 }}>Product Images</InputLabel>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                {imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Product Preview ${idx + 1}`}
                    style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'contain', borderRadius: 8 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://cdn.pixabay.com/photo/2017/02/16/13/42/box-2071537_1280.png';
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleDialogClose} />
        {mode !== 'view' && (
          <CustomIconButton
            icon={mode === 'edit' ? <Edit /> : <PersonAdd />}
            loading={loading}
            disabled={loading}
            color="black"
            text={buttonText}
            onClick={handleSubmit}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductEntityDialog;
