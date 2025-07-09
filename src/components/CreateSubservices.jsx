import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Close, PersonAdd } from "@mui/icons-material";
import { CustomIconButton } from "../custom/Button";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../utils/apiConfig";
import { showErrorToast, showSuccessToast } from "../Toast";
import Input from "../custom/Input";
import SelectInput from "../custom/Select";
import MultiSelectWithCheckbox from "../custom/MultiSelectWithCheckbox";

const groupedServices = {
  "Hair Cutting & Styling": ["Kids Haircut", "Layered Haircut", "Blow Dry Styling", "Feather Cut"],
  "Hair Coloring": ["Root Touch-Up", "Global Hair Color", "Ombre/Balayage", "Highlights / Lowlights"],
  "Hair Treatments": ["Keratin Treatment", "Hair Smoothening", "Scalp Detox", "Deep Conditioning"],
  "Bridal Makeup": ["Engagement Look", "Wedding Day Makeup", "Saree Draping", "Hair Accessories Setup"],
  "Skin Care": ["Facial Cleanup", "Fruit Facial", "Anti-Ageing Treatment", "Acne Control Facial"],
};

const CreateSubservices = ({ open, handleClose, serviceId, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubservices, setSelectedSubservices] = useState([]);
  const [customMode, setCustomMode] = useState(false);

  const authToken = Cookies.get("token");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubservices([]);
  };

  const handleDeleteSubservice = (sub) => {
    setSelectedSubservices((prev) => prev.filter((s) => s !== sub));
  };

  const handleAdd = async () => {
    const subservicesToAdd = customMode
      ? name?.trim()
        ? [name.trim()]
        : []
      : selectedSubservices.map((item) => item.value);


    if (subservicesToAdd.length === 0) {
      showErrorToast("Please select or enter a subservice name.");
      return;
    }

    setLoading(true);
    try {
      for (let sub of subservicesToAdd) {
        const response = await axios.post(
          `${API_BASE_URL}/service/subservice/create`,
          { serviceId: serviceId?.id || serviceId, name: sub },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response?.data?.status !== 200) {
          throw new Error(response?.data?.message || `Failed to add ${sub}`);
        }
      }
      showSuccessToast("Subservices created successfully");
      setSelectedSubservices([]);
      setName("");
      setSelectedCategory("");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error) {
      showErrorToast(error?.message || "Error creating subservices.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setName("");
    setSelectedCategory("");
    setSelectedSubservices([]);
    setCustomMode(false);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Sub Services</DialogTitle>
      <DialogContent>
        {!customMode && (
          <>
            <SelectInput
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select a service category"
              options={Object.keys(groupedServices).map((cat) => ({ label: cat, value: cat }))}
            />
            {selectedCategory && !customMode && (
              <MultiSelectWithCheckbox
                placeholder="Select one or more subservices"
                options={groupedServices[selectedCategory].map((sub) => ({
                  label: sub,
                  value: sub,
                }))}
                value={selectedSubservices}
                onChange={(val) => setSelectedSubservices(val)}
              />
            )}
          </>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={customMode}
              onChange={(e) => setCustomMode(e.target.checked)}
            />
          }
          label="Not available in these options"
          sx={{ mt: 2 }}
        />

        {customMode && (
          <Input
            placeholder="Enter custom subservice name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        )}
      </DialogContent>

      <DialogActions>
        <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleDialogClose} disabled={loading} />
        <CustomIconButton icon={<PersonAdd />} color="black" text="Add" onClick={handleAdd} disabled={loading} />
      </DialogActions>
    </Dialog>
  );
};

export default CreateSubservices;
