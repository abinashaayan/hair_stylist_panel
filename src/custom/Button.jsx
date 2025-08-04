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

  // Handle theme colors and determine button colors
  let buttonTextColor = color;
  let backgroundColor = color;
  
  // Map theme colors to actual color values
  if (color === 'primary') {
    backgroundColor = theme.palette.primary.main;
    buttonTextColor = theme.palette.primary.main;
  } else if (color === 'secondary') {
    backgroundColor = theme.palette.secondary.main;
    buttonTextColor = theme.palette.secondary.main;
  } else if (color === 'error') {
    backgroundColor = theme.palette.error.main;
    buttonTextColor = theme.palette.error.main;
  } else if (color === 'success') {
    backgroundColor = theme.palette.success.main;
    buttonTextColor = theme.palette.success.main;
  } else if (color === 'warning') {
    backgroundColor = theme.palette.warning.main;
    buttonTextColor = theme.palette.warning.main;
  } else if (color === 'info') {
    backgroundColor = theme.palette.info.main;
    buttonTextColor = theme.palette.info.main;
  } else if (color === 'red') {
    backgroundColor = '#f44336';
    buttonTextColor = '#f44336';
  }
  
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
          : backgroundColor,
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "12px 15px 12px 15px",
        fontWeight: fontWeight,
        ...currentSize,
        "&:hover": {
          opacity: disabled ? 1 : 0.8,
          backgroundColor: isOutlined
            ? `${buttonTextColor}1A`
            : backgroundColor,
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

