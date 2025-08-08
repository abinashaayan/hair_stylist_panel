import {
    Box,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputBase,
    Typography,
    useTheme,
} from "@mui/material";
import { Header } from "../../components";
import { SearchOutlined, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "../../custom/Table";
import { API_BASE_URL } from "../../utils/apiConfig";
import { tokens } from "../../theme";
import { showErrorToast, showSuccessToast } from "../../Toast";
import Cookies from "js-cookie";
import { CustomIconButton } from "../../custom/Button";
import { reviewsTableColumns } from "../../custom/TableColumns";
import Alert from "../../custom/Alert";
import useStylistProfile from "../../hooks/useStylistProfile";
import { useAuth } from "../../utils/context/AuthContext";

export default function AllReviews() {
    const { panelType } = useAuth();

    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [togglingIds, setTogglingIds] = useState({});
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const { profile } = useStylistProfile();
    console.log("profile", profile?.reviews);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const authToken = Cookies.get("token");

    const fetchAllReviews = async () => {
        if (panelType === "vendor") {
            const reviews = profile?.reviews?.map((review) => ({
                id: review._id,
                userName: review.userName,
                reviewed: review.reviewed,
                ratings: review.ratings,
                description: review.description,
                isVisible: review.isVisible,
                createdAt: new Date(review.createdAt).toLocaleDateString(),
            })) || [];

            setAllReviews(reviews);
            setLoading(false);
        } else {
            try {
                const response = await axios.get(`${API_BASE_URL}/user/admin/stylist-reviews`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response?.data?.success) {
                    const formattedData = response.data.reviews.map((review) => ({
                        id: review._id,
                        userName: review.userName,
                        reviewed: review.reviewed,
                        ratings: review.ratings,
                        description: review.description,
                        isVisible: review.isVisible,
                        createdAt: new Date(review.createdAt).toLocaleDateString(),
                    }));
                    setAllReviews(formattedData);
                }
            } catch (error) {
                showErrorToast("Error fetching reviews");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (authToken || panelType === "vendor") {
            fetchAllReviews();
        }
    }, [authToken, profile, panelType]);

    useEffect(() => {
        if (searchText === "") {
            setFilteredReviews(allReviews);
        } else {
            setFilteredReviews(
                allReviews.filter((review) =>
                    review.description?.toLowerCase()?.includes(searchText)
                )
            );
        }
    }, [allReviews, searchText]);

    const handleToggleStatus = async (id, currentStatus) => {
        if (panelType === "vendor") return;
        setTogglingIds((prev) => ({ ...prev, [id]: true }));
        try {
            const response = await axios.patch(`${API_BASE_URL}/user/admin/review-visibility`, {
                reviewId: id,
                status: currentStatus ? "inactive" : "active"
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response?.data?.success) {
                showSuccessToast("Visibility status updated!");
                await fetchAllReviews();
            } else {
                showErrorToast("Failed to update visibility.");
            }
        } catch (error) {
            console.error("Toggle error:", error);
            showErrorToast("An error occurred while toggling visibility.");
        } finally {
            setTogglingIds((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const response = await axios.delete(`${API_BASE_URL}/user/admin/stylist-reviews`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                data: {
                    reviewIds: [deleteId],
                },
            });
            if (response?.data?.success) {
                showSuccessToast("Review deleted successfully");
                setAllReviews((prev) => prev.filter((r) => r.id !== deleteId));
            } else {
                showErrorToast("Failed to delete review.");
            }
            await fetchAllReviews();
        } catch (error) {
            showErrorToast("An error occurred while deleting the review.");
        } finally {
            setDeleting(false);
            setAlertOpen(false);
            setDeleteId(null);
        }
    };


    const handleView = (row) => {
        setSelectedReview(row);
        setViewDialogOpen(true);
    };
    const columns = reviewsTableColumns({ handleToggleStatus, handleDelete, handleView, togglingIds, panelType });

    return (
        <Box className="p-1">
            {/* <Container maxWidth={false}> */}
                <Header title="Stylist Reviews" />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px', width: { xs: '100%', sm: 'auto' } }}>
                        <InputBase placeholder="Search Review" value={searchText} onChange={(e) => setSearchText(e.target.value)} sx={{ ml: 2, flex: 1 }} />
                        <IconButton type="button" sx={{ p: 1 }}>
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                </Box>
                <CustomTable columns={columns} rows={filteredReviews} loading={loading} />
            {/* </Container> */}

            <Alert
                open={alertOpen}
                title="Delete Review"
                description="Are you sure you want to delete this review? This action cannot be undone."
                onClose={deleting ? undefined : () => setAlertOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                disableCancel={deleting}
            />

            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Review Details</DialogTitle>
                <DialogContent dividers>
                    {selectedReview ? (
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Typography><strong>User ID:</strong> {selectedReview.userName}</Typography>
                            <Typography><strong>Stylist ID:</strong> {selectedReview.reviewed}</Typography>
                            <Typography><strong>Rating:</strong> {selectedReview.ratings} ⭐</Typography>
                            <Typography><strong>Description:</strong></Typography>
                            <Typography variant="body2" sx={{ pl: 1 }}>{selectedReview.description}</Typography>
                            <Typography><strong>Visible:</strong> {selectedReview.isVisible ? "Yes" : "No"}</Typography>
                            <Typography><strong>Created At:</strong> {selectedReview.createdAt}</Typography>
                        </Box>
                    ) : (
                        <Typography>No review selected.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <CustomIconButton icon={<Close />} color="red" text="Close" onClick={() => setViewDialogOpen(false)} />
                </DialogActions>
            </Dialog>
        </Box>
    );
};