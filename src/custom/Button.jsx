// src/custom/Button.jsx
import { Box, CircularProgress } from "@mui/material";

export const CustomIconButton = ({
  icon,
  text,
  color,
  onClick,
  loading = false,
  disabled = false,
  variant = "contained",
  fontWeight = "500",
}) => {
  const isOutlined = variant === "outlined";

  return (
    <Box
      sx={{
        height: "35px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isOutlined ? color : "white",
        borderRadius: "5px",
        border: isOutlined ? `1px solid ${color}` : "none",
        backgroundColor: disabled
          ? "#ccc"
          : isOutlined
          ? "transparent"
          : color,
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "12px 15px 12px 15px",
        fontWeight: fontWeight,
        "&:hover": {
          opacity: disabled ? 1 : 0.8,
          backgroundColor: isOutlined
            ? `${color}1A`
            : color,
        },
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) onClick(event);
      }}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: isOutlined ? color : "white" }} />
      ) : (
        <>
          {icon}
          {text && <span style={{ marginLeft: 8 }}>{text}</span>}
        </>
      )}
    </Box>
  );
};

