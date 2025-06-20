import {
    Box, Container, IconButton, InputBase, Typography, useTheme
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { userTableColumns } from "../../custom/userTableColumns";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import Cookies from "js-cookie";

const UserDetails = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
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

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        if (value === "") {
            setFilteredUsers(allUsers);
        } else {
            const filtered = allUsers.filter(user =>
                user.fullName.toLowerCase().includes(value) ||
                user.email.toLowerCase().includes(value) ||
                user.mobile.toLowerCase().includes(value)
            );
            setFilteredUsers(filtered);
        }
    };

    const handleDelete = (id) => {
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    };

    const handleView = (user) => {
        alert(`User Details:\n\nID: ${user.id}\nName: ${user.fullName}\nEmail: ${user.email}\nMobile: ${user.mobile}`);
    };

    const columns = userTableColumns({ handleDelete, handleView });

    return (
        <Box className="p-1 mt-4">
            <Container maxWidth={false}>
                <Header title="Users" />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px' }}>
                        <InputBase placeholder="Search user" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                </Box>
                <CustomTable columns={columns} rows={filteredUsers} loading={loading} checkboxSelection />
            </Container>
        </Box>
    );
};

export default UserDetails;
