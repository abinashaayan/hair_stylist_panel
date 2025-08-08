import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";

const Alert = ({ open, title = "Confirm", description = "Are you sure?", onClose, onConfirm, loading = false, disableCancel = false, confirmLabel = "Confirm", }) => {
    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (loading) return;
                if (reason === 'backdropClick') return;
                onClose(event, reason);
            }}
            disableEscapeKeyDown={loading}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            // disableBackdropClick={loading}
        >
            <DialogTitle id="alert-dialog-title" className="fw-bold">{title}</DialogTitle>

            <DialogContent>
                <MuiAlert variant="outlined" severity="error" sx={{ color: "red", backgroundColor: "transparent", borderColor: "red" }}>
                    <DialogContentText id="alert-dialog-description" sx={{ color: "red", fontWeight: "bold" }}>
                        {description}
                    </DialogContentText>
                </MuiAlert>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined" sx={{ textTransform: "none" }} disabled={disableCancel}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" sx={{ textTransform: "none" }} autoFocus disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm" style={{ marginRight: 8 }} /> : null}
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Alert;
