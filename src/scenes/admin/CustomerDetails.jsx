import { Box, Container, IconButton, InputBase, useTheme } from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { userTableColumns } from "../../custom/TableColumns";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import Cookies from "js-cookie";
import ShowDetailsDialog from "../../components/ShowDetailsDialog";
import Alert from "../../custom/Alert";
import { showSuccessToast, showErrorToast } from "../../Toast";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CustomIconButton } from "../../custom/Button";

export default function CustomerDetails() {
    const [allUsers, setAllUsers] = useState([]);
    const [originalUsers, setOriginalUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const authToken = Cookies.get("token");

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/user/admin/get-all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                }
            });
            setOriginalUsers(response.data.data);
            const formattedData = response?.data?.data.map((user) => ({
                id: user._id,
                fullName: user.fullName || "N/A",
                email: user.email || "N/A",
                mobile: user.phoneNumber || "N/A",
                role: user.role || "N/A",
                city: user.city || "N/A",
                gender: user.gender || "N/A",
                createdAt: new Date(user.createdAt).toLocaleDateString(),
            }));
            setAllUsers(formattedData);
            setFilteredUsers(formattedData);
        } catch (error) {
            console.log("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchFilteredUsers = async (text = "", date = null) => {
        if (!text && !date) {
            setFilteredUsers(allUsers);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/user/admin/search-users`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    query: text || undefined,
                    role: "user",
                    date: date ? dayjs(date).format('YYYY-MM-DD') : undefined,
                    page: 1,
                    limit: 100,
                },
            });
            const formattedData = response?.data?.users?.map((user) => ({
                id: user._id,
                fullName: user.fullName || "N/A",
                email: user.email || "N/A",
                mobile: user.phoneNumber || "N/A",
                role: user.role || "N/A",
                city: user.location?.city || "N/A",
                gender: user.gender || "N/A",
                createdAt: new Date(user.createdAt).toLocaleDateString(),
            }));
            setFilteredUsers(formattedData);
        } catch (error) {
            console.error("Search API error:", error);
            showErrorToast("Failed to search users");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        fetchFilteredUsers(value, selectedDate);
    };


    const handleDelete = (id) => {
        setDeleteId(id);
        setAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/user/admin/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response?.data?.status === 200) {
                showSuccessToast(response?.data?.message || "Service deleted successfully");
                const updatedAllUsers = allUsers.filter((user) => user.id !== deleteId);
                const updatedOriginalUsers = originalUsers.filter((user) => user._id !== deleteId);
                setAllUsers(updatedAllUsers);
                setOriginalUsers(updatedOriginalUsers);
                if (searchText) {
                    const filtered = updatedAllUsers.filter(user =>
                        user.fullName.toLowerCase().includes(searchText) ||
                        user.email.toLowerCase().includes(searchText) ||
                        user.mobile.toLowerCase().includes(searchText)
                    );
                    setFilteredUsers(filtered);
                } else {
                    setFilteredUsers(updatedAllUsers);
                }
            } else {
                showErrorToast("Failed to delete service.");
            }
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred while deleting.");
        } finally {
            setDeleting(false);
            setAlertOpen(false);
            setDeleteId(null);
        }
    };

    // const handleVerify = async (user) => {
    //     console.log(user, 'user')
    //     try {
    //         const response = await axios.patch(`${API_BASE_URL}/user/admin/update/${user.id}`, {
    //             isPhoneVerified: !user.isPhoneVerified,
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${authToken}`,
    //             },
    //         });
    //         console.log("resposne", response)
    //         showSuccessToast(`User ${!user.isPhoneVerified ? 'verified' : 'unverified'} successfully.`);
    //         fetchAllUsers();
    //     } catch (error) {
    //         console.error("Verification toggle failed", error);
    //         showErrorToast("Failed to update verification status");
    //     }
    // };

    const handleView = (user) => {
        const fullUserDetails = originalUsers.find(u => u._id === user.id);
        setSelectedUserDetails(fullUserDetails);
        setIsDetailsDialogOpen(true);
    };

    const handleReset = () => {
        setSearchText("");
        setSelectedDate(null);
        fetchFilteredUsers("", null);
    };

    const columns = userTableColumns({ handleDelete, handleView });

    return (
        <Box className="p-1">
            {/* <Container maxWidth={false}> */}
                <Header title="All Customers" />
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box display="flex" className="me-2" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px' }}>
                        <InputBase placeholder="Search user" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={selectedDate}
                            onChange={(newDate) => {
                                setSelectedDate(newDate);
                                fetchFilteredUsers(searchText, newDate);
                            }}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    variant: 'outlined',
                                    sx: {
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '15px',
                                            '& fieldset': {
                                                borderColor: '#420c36',
                                                borderWidth: '1.5px',
                                            },
                                        },
                                    },
                                },
                            }}
                            className="me-2"
                        />
                    </LocalizationProvider>
                    <CustomIconButton color="red" text="Reset" onClick={handleReset} />
                </Box>
                <CustomTable columns={columns} rows={filteredUsers} loading={loading} checkboxSelection />
            {/* </Container> */}
            <ShowDetailsDialog
                open={isDetailsDialogOpen}
                onClose={() => setIsDetailsDialogOpen(false)}
                data={selectedUserDetails}
            />
            <Alert
                open={alertOpen}
                title="Delete Service"
                description="Are you sure you want to delete this service? This action cannot be undone."
                onClose={deleting ? undefined : () => setAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                disableCancel={deleting}
            />
        </Box>
    );
};