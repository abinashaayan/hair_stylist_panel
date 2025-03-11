import { Box, CircularProgress } from "@mui/material";

export const CustomIconButton = ({
  icon,
  text,
  color,
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <Box
      sx={{
        height: "35px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "5px",
        backgroundColor: disabled ? "#ccc" : color,
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "12px 15px 12px 15px",
        "&:hover": { opacity: disabled ? 1 : 0.8 },
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) onClick(event);
      }}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: "white" }} />
      ) : (
        <>
          {icon} {/* ✅ Show icon */}
          {text && <span style={{ marginLeft: 8 }}>{text}</span>}
        </>
      )}
    </Box>
  );
};
