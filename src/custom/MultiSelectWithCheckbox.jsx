import React from "react";
import {
  Autocomplete,
  Checkbox,
  TextField,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultiSelectWithCheckbox = ({
  label = "Select Options",
  placeholder = "Choose",
  options = [],
  value = [],
  onChange,
  disabled = false,
}) => {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={options}
      getOptionLabel={(option) => option.label || option}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      disabled={disabled}
      renderOption={(props, option, { selected }) => {
        const { key, ...other } = props;
        return (
          <li key={key} {...other}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label || option}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  );
};

export default MultiSelectWithCheckbox;
