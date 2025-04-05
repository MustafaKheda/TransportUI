import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const DriverSelector = () => {
  const [drivers, setDrivers] = useState([
    { name: "John Doe", phone: "1234567890" },
    { name: "Jane Smith", phone: "9876543210" },
  ]);

  const [orderData, setOrderData] = useState({
    driverName: "",
    driverPhone: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");

  const handleAddDriver = () => {
    const trimmedName = newDriverName.trim();
    const trimmedPhone = newDriverPhone.trim();
    if (trimmedName && trimmedPhone) {
      const newDriver = { name: trimmedName, phone: trimmedPhone };
      setDrivers((prev) => [...prev, newDriver]);
      setOrderData({
        driverName: trimmedName,
        driverPhone: trimmedPhone,
      });
    }
    setOpenDialog(false);
    setNewDriverName("");
    setNewDriverPhone("");
  };

  const handleDriverChange = (event, newValue) => {
    if (!newValue) return;

    const foundDriver = drivers.find((d) => d.name === newValue);
    if (foundDriver) {
      setOrderData({
        driverName: foundDriver.name,
        driverPhone: foundDriver.phone,
      });
    } else {
      // Driver not found — open dialog with the entered name
      setNewDriverName(newValue);
      setNewDriverPhone(""); // reset phone
      setOpenDialog(true);
    }
  };

  return (
    <Box>
      <Autocomplete
        freeSolo
        options={drivers.map((d) => d.name)}
        value={orderData.driverName || ""}
        onChange={(e, newValue) => handleDriverChange(e, newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select or Add Driver"
            fullWidth
          />
        )}
      />

      {/* Add Driver Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Driver</DialogTitle>
        <DialogContent>
          <TextField
            label="Driver Name"
            value={newDriverName || ""}
            onChange={(e) => setNewDriverName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Driver Phone"
            value={newDriverPhone || ""}
            onChange={(e) => setNewDriverPhone(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddDriver}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverSelector;
