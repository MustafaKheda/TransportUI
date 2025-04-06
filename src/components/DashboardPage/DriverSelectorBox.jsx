import React, { useState } from "react";
import { TextField, Autocomplete, Box } from "@mui/material";

const DriverAutocomplete = () => {
  const [drivers, setDrivers] = useState([
    { name: "John Doe", phone: "123-456-7890" },
    { name: "Jane Smith", phone: "987-654-3210" },
    { name: "Alex Johnson", phone: "555-123-4567" },
  ]);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (event, newValue) => {
    if (typeof newValue === "string") {
      // User typed a new name and hit Enter
      const existing = drivers.find((d) => d.name === newValue);
      if (existing) {
        setSelectedDriver(existing);
      } else {
        const newDriver = { name: newValue, phone: "" };
        setDrivers((prev) => [...prev, newDriver]);
        setSelectedDriver(newDriver);
      }
    } else if (newValue) {
      // Selected from list
      setSelectedDriver(newValue);
    } else {
      // Cleared
      setSelectedDriver(null);
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", gap: 3 }}>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          freeSolo
          options={drivers}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          value={selectedDriver}
          inputValue={inputValue}
          onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
          onChange={handleSelect}
          renderInput={(params) => (
            <TextField {...params} label="Driver Name" variant="outlined" fullWidth />
          )}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          value={selectedDriver?.phone || ""}
          onChange={(e) => {
            if (selectedDriver) {
              const updatedDriver = {
                ...selectedDriver,
                phone: e.target.value,
              };
              setSelectedDriver(updatedDriver);
              setDrivers((prev) =>
                prev.map((d) =>
                  d.name === selectedDriver.name ? updatedDriver : d
                )
              );
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default DriverAutocomplete;
