import { Box } from "@mui/material";

export const CustomIconButton = ({ icon, color, onClick }) => {
    return (
        <Box
            sx={{
                height: "35px",
                width: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                borderRadius: "5px",
                backgroundColor: color,
                cursor: "pointer",
                "&:hover": { opacity: 0.8 }
            }}
            onClick={(event) => {
                event.stopPropagation();
                onClick(event);
            }}
        >
            {icon}
        </Box>
    );
};

