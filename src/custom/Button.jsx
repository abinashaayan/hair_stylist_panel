// src/custom/Button.jsx
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const CustomIconButton = ({
  icon,
  text,
  color,
  onClick,
  loading = false,
  disabled = false,
  variant = "contained",
  fontWeight = "500",
  size = "medium",
  sx = {}, // <-- accept sx prop
}) => {
  const theme = useTheme();
  const isOutlined = variant === "outlined";
  const sizeStyles = {
    small: {
      height: "30px",
      padding: "6px 12px",
      fontSize: "0.75rem",
    },
    medium: {
      height: "36px",
      padding: "8px 15px",
      fontSize: "0.875rem",
    },
    large: {
      height: "44px",
      padding: "10px 18px",
      fontSize: "1rem",
    },
  };
  const currentSize = sizeStyles[size] || sizeStyles.medium;

  // Determine text color for outlined variant in dark mode
  let buttonTextColor = color;
  if (isOutlined && !color && theme.palette.mode === 'dark') {
    buttonTextColor = 'white';
  }

  return (
    <Box
      sx={{
        height: "35px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isOutlined ? buttonTextColor : "white",
        borderRadius: "5px",
        border: isOutlined ? `1px solid ${buttonTextColor}` : "none",
        backgroundColor: disabled
          ? "#ccc"
          : isOutlined
          ? "transparent"
          : color,
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "12px 15px 12px 15px",
        fontWeight: fontWeight,
        ...currentSize,
        "&:hover": {
          opacity: disabled ? 1 : 0.8,
          backgroundColor: isOutlined
            ? `${buttonTextColor}1A`
            : color,
        },
        ...sx, // <-- merge/override with sx prop
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) onClick(event);
      }}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: isOutlined ? buttonTextColor : "white" }} />
      ) : (
        <>
          {icon}
          {text && <span style={{ marginLeft: 8 }}>{text}</span>}
        </>
      )}
    </Box>
  );
};

