
import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";

const DriverAutocomplete = ({ driverInfo = [], orderData, setOrderData, phoneError, nameError, phoneHelperText, nameHelperText, setFormErrors, formErrors }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);


  const handleSelect = (event, newValue) => {
    let name = "";
    let phone = "";
    if (typeof newValue === "string") {
      name = newValue;
    } else if (newValue?.name) {
      name = newValue.name;
      phone = newValue.phoneNumber || "";
    }

    setOrderData((prev) => ({
      ...prev,
      driverName: name,
      driverPhone: phone,
    }));
  };

  return (
    <Box sx={{ display: "flex", width: "100%", gap: 3 }}>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          freeSolo
          options={driverInfo}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name || ""
          }

          value={orderData.driverName}
          onInputChange={(e, newInputValue) => {
            setFormErrors({ ...formErrors, driverName: null });
            setOrderData((prev) => ({
              ...prev,
              driverName: newInputValue,
            }));

          }}
          size="small"
          onChange={handleSelect}
          renderInput={(params) => (
            <TextField
              error={nameError}
              helperText={nameHelperText}
              size="small"
              {...params}
              label="Driver Name"
              variant="outlined"
              fullWidth
            />
          )}
        />
        {/* <TextField
          label="Driver Name"
          variant="outlined"
          fullWidth
          size="small"
          name="driverName"
          error={nameError}
          helperText={nameHelperText}
          value={orderData.driverName}
          onChange={(e) => {
            // const newPhone = e.target.value;
            // setPhoneNumber(newPhone);

            // setSelectedDriver((prev) => ({
            //   ...prev,
            //   name: inputValue,
            //   phoneNumber: newPhone,
            // }));
            setFormErrors({ ...formErrors, driverName: null });
            setOrderData((prev) => ({
              ...prev,
              driverName: e.target.value,
            }));
          }}
        /> */}
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="driverPhone"
          size="small"
          error={phoneError}
          helperText={phoneHelperText}
          value={orderData.driverPhone}
          onChange={(e) => {
            // const newPhone = e.target.value;
            // setPhoneNumber(newPhone);

            // setSelectedDriver((prev) => ({
            //   ...prev,
            //   name: inputValue,
            //   phoneNumber: newPhone,
            // }));
            setFormErrors({ ...formErrors, driverPhone: null });

            setOrderData((prev) => ({
              ...prev,
              driverPhone: e.target.value,
            }));
          }}
        />
      </Box>
    </Box>
  );
};

export default DriverAutocomplete;
