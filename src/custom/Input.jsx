import { TextField, InputAdornment, IconButton } from "@mui/material";

const Input = ({ placeholder, type, value, onChange, icon, endIcon, onEndIconClick, height = 40 }) => {
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
                    height: height,
                    "& fieldset": { border: "1px solid #bdbdbd" },
                    "& .MuiInputBase-input": {
                        padding: "8px 10px",
                        fontSize: "14px",
                        height: "100%",
                        maxHeight:"50px"
                    },
                },
            }}
        />
    );
};

export default Input;
