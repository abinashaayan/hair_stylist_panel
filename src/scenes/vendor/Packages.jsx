import {
  Box,
  Container,
  IconButton,
  InputBase,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, PersonAdd, ExpandMore, AttachMoney, TrendingUp, LocalOffer, History } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { packageTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import PackageEntityDialog from '../../components/PackageEntityDialog';
import Input from "../../custom/Input";
import SelectInput from "../../custom/Select";

export default function Packages() {
  const [allServices, setAllServices] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isViewDialog, setIsViewDialog] = useState(false);
  const [openPackageDialog, setOpenPackageDialog] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Service Pricing Management States
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [promotionalDialogOpen, setPromotionalDialogOpen] = useState(false);
  const [pricingHistoryDialogOpen, setPricingHistoryDialogOpen] = useState(false);
  const [dynamicPricingDialogOpen, setDynamicPricingDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [pricingHistory, setPricingHistory] = useState([]);
  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);

  // Service Pricing Form States
  const [servicePricing, setServicePricing] = useState([]);
  const [promotionalPricing, setPromotionalPricing] = useState({
    name: '',
    description: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    applicableServices: [],
    applicableSubServices: [],
    clientGroups: []
  });
  const [dynamicPricingSettings, setDynamicPricingSettings] = useState({
    serviceId: '',
    subServiceId: '',
    isDynamic: false,
    peakHourMultiplier: 1.0,
    demandMultiplier: 1.0
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchAllPackage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/package/stylist/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response?.data?.status === 200 && response?.data?.success) {
        const fullData = (response?.data?.data || []).map((item) => ({ ...item, id: item._id }));
        setAllServices(fullData);
      } else {
        showErrorToast(response?.data?.message || "Failed to fetch packages");
      }
    } catch (error) {
      showErrorToast("Error fetching packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/service/get-active`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data?.status === 200) {
        setServices(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchSubServicesByServiceId = async (serviceId) => {
    if (!serviceId) return setSubServices([]);
    try {
      const response = await axios.get(`${API_BASE_URL}/service/subservice/active/get/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data?.status === 200) {
        setSubServices(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching sub-services:", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllPackage();
      fetchServices();
    }
  }, [authToken]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredUsers(allServices);
    } else {
      setFilteredUsers(
        allServices.filter((pkg) =>
          (pkg.title || pkg.name || "").toLowerCase().includes(searchText)
        )
      );
    }
  }, [allServices, searchText]);

  const handleOpenCategory = () => {
    setEditRow(null);
    setEditMode(false);
    setOpenPackageDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenPackageDialog(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/package/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.status === 200) {
        showSuccessToast(response?.data?.message || "Package deleted successfully");
        setAllServices((prevServices) => prevServices.filter((service) => service.id !== deleteId));
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteId));
        await fetchAllPackage();
      } else {
        showErrorToast("Failed to delete package.");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
    } finally {
      setDeleting(false);
      setAlertOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setEditMode(true);
    setOpenPackageDialog(true);
  };

  const handleView = (row) => {
    setViewRow(row);
    setIsViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialog(false);
    setViewRow(null);
  };

  // Service Pricing Management Functions
  const handleServicePricing = (row) => {
    console.log(row, 'row')
    setSelectedPackage(row);
    // Transform the servicePricing to match the form structure
    const transformedServicePricing = (row.servicePricing || []).map(pricing => ({
      serviceId: pricing.serviceId?._id || pricing.serviceId,
      subServiceId: pricing.subServiceId?._id || pricing.subServiceId,
      currentPrice: pricing.currentPrice,
      basePrice: pricing.basePrice,
      isDynamic: pricing.isDynamic,
      peakHourMultiplier: pricing.peakHourMultiplier,
      demandMultiplier: pricing.demandMultiplier,
      reason: pricing.reason
    }));
    setServicePricing(transformedServicePricing);
    // Fetch sub-services for the selected package's service
    if (row.serviceId?._id) {
      fetchSubServicesByServiceId(row.serviceId._id);
    }
    setPricingDialogOpen(true);
  };

  const handlePromotionalPricing = (row) => {
    setSelectedPackage(row);
    setPromotionalDialogOpen(true);
  };

  const handlePricingHistory = async (row) => {
    setSelectedPackage(row);
    try {
      const response = await axios.get(`${API_BASE_URL}/package/${row._id}/pricing-history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response?.data?.status === 200) {
        // Handle the new API response structure
        const pricingHistoryData = response.data.data?.priceHistory || [];
        setPricingHistory(pricingHistoryData);
        setPricingHistoryDialogOpen(true);
      }
    } catch (error) {
      showErrorToast("Failed to fetch pricing history");
    }
  };

  const handleDynamicPricing = (row) => {
    setSelectedPackage(row);
    setDynamicPricingDialogOpen(true);
  };

  const addServicePricing = () => {
    const newPricing = {
      serviceId: selectedPackage?.serviceId?._id || selectedPackage?.serviceId || '',
      subServiceId: '',
      currentPrice: '',
      basePrice: '',
      isDynamic: false,
      peakHourMultiplier: 1.0,
      demandMultiplier: 1.0,
      reason: ''
    };
    setServicePricing([...servicePricing, newPricing]);
    // Fetch sub-services if service is available
    if (selectedPackage?.serviceId?._id) {
      fetchSubServicesByServiceId(selectedPackage.serviceId._id);
    }
  };

  const updateServicePricing = (index, field, value) => {
    const updatedPricing = [...servicePricing];
    updatedPricing[index] = { ...updatedPricing[index], [field]: value };
    setServicePricing(updatedPricing);
  };

  const removeServicePricing = (index) => {
    setServicePricing(servicePricing.filter((_, i) => i !== index));
  };

  const handleServicePricingSubmit = async () => {
    if (!selectedPackage?._id) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/package/${selectedPackage._id}/pricing`, {
        servicePricing: servicePricing
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response?.data?.status === 200) {
        showSuccessToast("Service pricing updated successfully");
        setPricingDialogOpen(false);
        fetchAllPackage();
      } else {
        showErrorToast("Failed to update service pricing");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to update service pricing");
    }
  };

  const handlePromotionalPricingSubmit = async () => {
    if (!selectedPackage?._id) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/package/${selectedPackage._id}/promotional-pricing`, promotionalPricing, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response?.data?.status === 200) {
        showSuccessToast("Promotional pricing added successfully");
        setPromotionalDialogOpen(false);
        fetchAllPackage();
      } else {
        showErrorToast("Failed to add promotional pricing");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to add promotional pricing");
    }
  };

  const handleDynamicPricingSubmit = async () => {
    if (!selectedPackage?._id) return;

    try {
      const response = await axios.patch(`${API_BASE_URL}/package/${selectedPackage._id}/dynamic-pricing`, dynamicPricingSettings, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response?.data?.status === 200) {
        showSuccessToast("Dynamic pricing settings updated successfully");
        setDynamicPricingDialogOpen(false);
        fetchAllPackage();
      } else {
        showErrorToast("Failed to update dynamic pricing settings");
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to update dynamic pricing settings");
    }
  };

  const serviceOptions = services.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  const subServiceOptions = subServices.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  const columns = packageTableColumns({
    handleDelete,
    handleView,
    handleEdit,
    handleServicePricing,
    handlePromotionalPricing,
    handlePricingHistory,
    handleDynamicPricing
  });

  return (
    <Box className="p-1">
      <Header title="Create Package" />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
        <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px', width: { xs: '100%', sm: 'auto' }, }}>
          <InputBase placeholder="Search Package" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box>
        <CustomIconButton icon={<PersonAdd />} text="Add New Package" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleOpenCategory} sx={{ width: { xs: '100%', sm: 'auto' } }} />
      </Box>
      <CustomTable columns={columns} rows={filteredUsers} loading={loading} noRowsMessage="No products found" />

      <PackageEntityDialog
        open={openPackageDialog}
        handleClose={() => {
          setOpenPackageDialog(false);
          setEditMode(false);
          setEditRow(null);
        }}
        onSuccess={() => {
          setOpenPackageDialog(false);
          setEditMode(false);
          setEditRow(null);
          fetchAllPackage();
        }}
        editMode={editMode}
        rowData={editRow}
      />

      <PackageEntityDialog
        open={isViewDialog}
        handleClose={handleCloseViewDialog}
        viewMode={true}
        rowData={viewRow}
      />

      {/* Service Pricing Dialog */}
      <Dialog open={pricingDialogOpen} onClose={() => setPricingDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoney />
            <Typography variant="h6">Service Pricing Management</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Package: {selectedPackage?.title || selectedPackage?.name}
            </Typography>
          </Box>

          <Box mb={2}>
            <CustomIconButton text="Add Service Pricing" color="#6d295a" onClick={addServicePricing} />
          </Box>

          {servicePricing?.map((pricing, index) => (
            <Box key={index} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight="bold">Service Pricing {index + 1}</Typography>
                <CustomIconButton
                  text="Remove"
                  color="red"
                  onClick={() => removeServicePricing(index)}
                  size="small"
                />
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <label style={{ fontWeight: 500, fontSize: '12px' }}>Service</label>
                  <SelectInput
                    value={pricing.serviceId}
                    onChange={(e) => {
                      updateServicePricing(index, 'serviceId', e.target.value);
                      updateServicePricing(index, 'subServiceId', '');
                      fetchSubServicesByServiceId(e.target.value);
                    }}
                    options={serviceOptions}
                    placeholder="Select Service"
                  />
                </Box>
                <Box>
                  <label style={{ fontWeight: 500, fontSize: '12px' }}>Sub Service</label>
                  <SelectInput
                    value={pricing.subServiceId}
                    onChange={(e) => updateServicePricing(index, 'subServiceId', e.target.value)}
                    options={subServiceOptions}
                    placeholder="Select Sub Service"
                    disabled={!pricing.serviceId}
                  />
                </Box>
                <Box>
                  <label style={{ fontWeight: 500, fontSize: '12px' }}>Current Price</label>
                  <Input
                    placeholder="Current Price"
                    type="number"
                    value={pricing.currentPrice}
                    onChange={(e) => updateServicePricing(index, 'currentPrice', e.target.value)}
                  />
                </Box>
                <Box>
                  <label style={{ fontWeight: 500, fontSize: '12px' }}>Base Price</label>
                  <Input
                    placeholder="Base Price"
                    type="number"
                    value={pricing.basePrice}
                    onChange={(e) => updateServicePricing(index, 'basePrice', e.target.value)}
                  />
                </Box>
                <Box>
                  <label style={{ fontWeight: 500, fontSize: '12px' }}>Peak Hour Multiplier</label>
                  <Input
                    placeholder="1.0"
                    type="number"
                    step="0.1"
                    value={pricing.peakHourMultiplier}
                    onChange={(e) => updateServicePricing(index, 'peakHourMultiplier', e.target.value)}
                  />
                </Box>
                <Box>
                  <label style={{ fontWeight: 500, fontSize: '12px' }}>Demand Multiplier</label>
                  <Input
                    placeholder="1.0"
                    type="number"
                    step="0.1"
                    value={pricing.demandMultiplier}
                    onChange={(e) => updateServicePricing(index, 'demandMultiplier', e.target.value)}
                  />
                </Box>
                <Box>
                  <label style={{ fontWeight: 500, fontSize: '12px' }}>Reason</label>
                  <Input
                    placeholder="Pricing reason"
                    value={pricing.reason}
                    onChange={(e) => updateServicePricing(index, 'reason', e.target.value)}
                  />
                </Box>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={pricing.isDynamic}
                        onChange={(e) => updateServicePricing(index, 'isDynamic', e.target.checked)}
                      />
                    }
                    label="Dynamic Pricing"
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <CustomIconButton text="Cancel" color="red" onClick={() => setPricingDialogOpen(false)} />
          <CustomIconButton text="Save Pricing" color="#6d295a" onClick={handleServicePricingSubmit} />
        </DialogActions>
      </Dialog>

      {/* Promotional Pricing Dialog */}
      <Dialog open={promotionalDialogOpen} onClose={() => setPromotionalDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <LocalOffer />
            <Typography variant="h6">Add Promotional Pricing</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Package: {selectedPackage?.title || selectedPackage?.name}
            </Typography>
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              <label style={{ fontWeight: 500 }}>Promotion Name</label>
              <Input
                placeholder="Valentine's Day Special"
                value={promotionalPricing.name}
                onChange={(e) => setPromotionalPricing({ ...promotionalPricing, name: e.target.value })}
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Discount Percentage</label>
              <Input
                placeholder="20"
                type="number"
                value={promotionalPricing.discountPercentage}
                onChange={(e) => setPromotionalPricing({ ...promotionalPricing, discountPercentage: e.target.value })}
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Start Date</label>
              <Input
                type="date"
                value={promotionalPricing.startDate}
                onChange={(e) => setPromotionalPricing({ ...promotionalPricing, startDate: e.target.value })}
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>End Date</label>
              <Input
                type="date"
                value={promotionalPricing.endDate}
                onChange={(e) => setPromotionalPricing({ ...promotionalPricing, endDate: e.target.value })}
              />
            </Box>
            <Box gridColumn="span 2">
              <label style={{ fontWeight: 500 }}>Description</label>
              <Input
                placeholder="20% off all hair services for Valentine's Day"
                multiline
                rows={3}
                value={promotionalPricing.description}
                onChange={(e) => setPromotionalPricing({ ...promotionalPricing, description: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <CustomIconButton text="Cancel" color="red" onClick={() => setPromotionalDialogOpen(false)} />
          <CustomIconButton text="Add Promotion" color="#6d295a" onClick={handlePromotionalPricingSubmit} />
        </DialogActions>
      </Dialog>

      {/* Pricing History Dialog */}
      <Dialog open={pricingHistoryDialogOpen} onClose={() => setPricingHistoryDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <History />
            <Typography variant="h6">Pricing History</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Package: {selectedPackage?.title || selectedPackage?.name}
            </Typography>
          </Box>

          {pricingHistory.length > 0 ? (
            pricingHistory.map((history, index) => (
              <Box key={index} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  Price Update - {history.changedAt ? new Date(history.changedAt).toLocaleDateString() : 'N/A'}
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Service</Typography>
                    <Typography variant="body2">{history.serviceId?.name || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Sub Service</Typography>
                    <Typography variant="body2">{history.subServiceId?.name || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Old Price</Typography>
                    <Typography variant="body2">₹{history.oldPrice || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">New Price</Typography>
                    <Typography variant="body2">₹{history.newPrice || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Reason</Typography>
                    <Typography variant="body2">{history.reason || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Changed At</Typography>
                    <Typography variant="body2">{history.changedAt ? new Date(history.changedAt).toLocaleString() : 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No pricing history available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <CustomIconButton text="Close" color="red" onClick={() => setPricingHistoryDialogOpen(false)} />
        </DialogActions>
      </Dialog>

      {/* Dynamic Pricing Settings Dialog */}
      <Dialog open={dynamicPricingDialogOpen} onClose={() => setDynamicPricingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUp />
            <Typography variant="h6">Dynamic Pricing Settings</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Package: {selectedPackage?.title || selectedPackage?.name}
            </Typography>
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              <label style={{ fontWeight: 500 }}>Service</label>
              <SelectInput
                value={dynamicPricingSettings.serviceId}
                onChange={(e) => {
                  setDynamicPricingSettings({ ...dynamicPricingSettings, serviceId: e.target.value });
                  fetchSubServicesByServiceId(e.target.value);
                }}
                options={serviceOptions}
                placeholder="Select Service"
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Sub Service</label>
              <SelectInput
                value={dynamicPricingSettings.subServiceId}
                onChange={(e) => setDynamicPricingSettings({ ...dynamicPricingSettings, subServiceId: e.target.value })}
                options={subServiceOptions}
                placeholder="Select Sub Service"
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Peak Hour Multiplier</label>
              <Input
                placeholder="1.0"
                type="number"
                step="0.1"
                value={dynamicPricingSettings.peakHourMultiplier}
                onChange={(e) => setDynamicPricingSettings({ ...dynamicPricingSettings, peakHourMultiplier: e.target.value })}
              />
            </Box>
            <Box>
              <label style={{ fontWeight: 500 }}>Demand Multiplier</label>
              <Input
                placeholder="1.0"
                type="number"
                step="0.1"
                value={dynamicPricingSettings.demandMultiplier}
                onChange={(e) => setDynamicPricingSettings({ ...dynamicPricingSettings, demandMultiplier: e.target.value })}
              />
            </Box>
            <Box gridColumn="span 2">
              <FormControlLabel
                control={
                  <Switch
                    checked={dynamicPricingSettings.isDynamic}
                    onChange={(e) => setDynamicPricingSettings({ ...dynamicPricingSettings, isDynamic: e.target.checked })}
                  />
                }
                label="Enable Dynamic Pricing"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <CustomIconButton text="Cancel" color="red" onClick={() => setDynamicPricingDialogOpen(false)} />
          <CustomIconButton text="Save Settings" color="#6d295a" onClick={handleDynamicPricingSubmit} />
        </DialogActions>
      </Dialog>

      <Alert
        open={alertOpen}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        onClose={() => setAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        disableCancel={deleting}
      />
    </Box>
  );
};