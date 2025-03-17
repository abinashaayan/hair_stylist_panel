import {
    Box, Container, IconButton, InputBase, useTheme
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, DeleteOutline, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { userTableColumns } from "../../custom/userTableColumns";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";

const UserDetails = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/users/getAllUsers`);
            console.log(response.data.data)
            const formattedData = response?.data?.data.map((user) => ({
                id: user.userId,
                userId: user.userId || "N/A",
                email: user.email || "N/A",
                mobile: user.mobile || "N/A",
                status: user?.isActive||"N/A",
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
                user.userId.toLowerCase().includes(value) ||
                user.email.toLowerCase().includes(value) ||
                user.mobile.toLowerCase().includes(value)
            );
            setFilteredUsers(filtered);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await axios.put(`http://54.236.98.193:5050/api/users/admin/blockUnblockUser/${id}`);
           console.log(response.data)
            const updatedStatus = response.data.data
            console.log(updatedStatus)
            setFilteredUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, status: updatedStatus} : user
                )
            );
            // fetchAllUsers();
        }
        catch (error) {
            return console.log(error);
        }
    };

    const handleDelete = (id) => {
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    };

    const handleView = (user) => {
        alert(`User Details:\n\nID: ${user.userId}\nEmail: ${user.email}\nMobile: ${user.mobile}`);
    };


    const columns = userTableColumns({ handleToggleStatus, handleDelete, handleView });


    return (
        <Container maxWidth={false}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Header title="Users" />
                <Box display="flex" alignItems="center" borderRadius="3px" bgcolor={colors.primary[400]}>
                    <InputBase
                        placeholder="Search user"
                        value={searchText}
                        onChange={handleSearch}
                        sx={{ ml: 2, flex: 1 }}
                    />
                    <IconButton type="button" sx={{ p: 1 }}>
                        <SearchOutlined />
                    </IconButton>
                </Box>
            </Box>
            <CustomTable columns={columns} rows={filteredUsers} onStatusToggle={handleToggleStatus} loading={loading} checkboxSelection />
        </Container>
    );
};

export default UserDetails;
