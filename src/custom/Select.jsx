import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
} from "@mui/material";

const SelectInput = ({
  label,
  value,
  onChange,
  options = [],
  name,
  height = 40,
  icon,
  endIcon,
  onEndIconClick,
  placeholder = "Select",
  disabled = false,
  multiple = false,
}) => {
  return (
    <FormControl fullWidth margin="normal">
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        multiple={multiple}
        value={value}
        onChange={onChange}
        displayEmpty
        name={name}
        disabled={disabled}
        sx={{
          bgcolor: "#f5f5f5",
          borderRadius: 1,
          minHeight: height,
          "& fieldset": { border: "1px solid #bdbdbd" },
          "& .MuiSelect-select": {
            padding: "8px 10px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
          },
        }}
        startAdornment={
          icon && <InputAdornment position="start">{icon}</InputAdornment>
        }
        endAdornment={
          endIcon && (
            <InputAdornment position="end">
              <IconButton onClick={onEndIconClick}>{endIcon}</IconButton>
            </InputAdornment>
          )
        }
        renderValue={(selected) => {
          if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return <span style={{ color: "#9e9e9e" }}>{placeholder}</span>;
          }

          if (multiple && Array.isArray(selected)) {
            return selected.join(", ");
          }

          return selected;
        }}
      >
        {!multiple && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value || option} value={option.value || option}>
            {option.label || option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
