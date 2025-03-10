import { TextField, InputAdornment, IconButton } from "@mui/material";

const Input = ({ placeholder, type, value, onChange, icon, endIcon, onEndIconClick }) => {
    return (
        <TextField
            fullWidth
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
            margin="normal"
            InputProps={{
                startAdornment: icon && (
                    <InputAdornment position="start">{icon}</InputAdornment>
                ),
                endAdornment: endIcon && (
                    <InputAdornment position="end">
                        <IconButton onClick={onEndIconClick}>{endIcon}</IconButton>
                    </InputAdornment>
                ),
                sx: {
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                    height: 40,
                    "& fieldset": { border: "none" },
                    "& .MuiInputBase-input": {
                        padding: "8px 10px",
                        fontSize: "14px",
                    },
                },
            }}
        />
    );
};

export default Input;
