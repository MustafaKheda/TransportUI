import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  Box,
} from "@mui/material";

const consignerList = ["ABC Logistics", "XYZ Transport", "PQR Shipping"];
const consigneeList = ["DEF Enterprises", "LMN Distributors", "STU Retailers"];
const locationList = ["New York", "Los Angeles", "Chicago", "Houston"];
const truckNumbers = ["TN-001", "TN-002", "TN-003"];
const drivers = [
  { name: "John Doe", phone: "9876543210" },
  { name: "Jane Smith", phone: "8765432109" },
  { name: "Mike Johnson", phone: "7654321098" },
];

const AddNewOrderModal = ({ isOpen, onClose }) => {
  const [orderData, setOrderData] = useState({
    date: new Date().toISOString().split("T")[0],
    consignmentNo: "",
    consigner: "",
    consignee: "",
    from: "",
    to: "",
    truckNumber: "",
    driverName: "",
    driverPhone: "",
  });

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold" }}>Add New Order</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {/* Date & Consignment Number */}
          <TextField
            label="Date"
            type="date"
            name="date"
            value={orderData.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Consignment Number"
            name="consignmentNo"
            value={orderData.consignmentNo}
            onChange={handleChange}
            fullWidth
          />

          {/* Consigner & Consignee */}
          <Autocomplete
            options={consignerList}
            renderInput={(params) => <TextField {...params} label="Consigner" fullWidth />}
            onChange={(event, newValue) => setOrderData({ ...orderData, consigner: newValue })}
          />
          <Autocomplete
            options={consigneeList}
            renderInput={(params) => <TextField {...params} label="Consignee" fullWidth />}
            onChange={(event, newValue) => setOrderData({ ...orderData, consignee: newValue })}
          />

          {/* From & To Locations */}
          <Autocomplete
            options={locationList}
            renderInput={(params) => <TextField {...params} label="From Location" fullWidth />}
            onChange={(event, newValue) => setOrderData({ ...orderData, from: newValue })}
          />
          <Autocomplete
            options={locationList}
            renderInput={(params) => <TextField {...params} label="To Location" fullWidth />}
            onChange={(event, newValue) => setOrderData({ ...orderData, to: newValue })}
          />

          {/* Truck Number */}
          <Select
            name="truckNumber"
            value={orderData.truckNumber}
            onChange={handleChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select Truck</MenuItem>
            {truckNumbers.map((truck) => (
              <MenuItem key={truck} value={truck}>{truck}</MenuItem>
            ))}
          </Select>

          {/* Driver Name & Driver Phone */}
          <Select
            name="driverName"
            value={orderData.driverName}
            onChange={(e) => {
              const selectedDriver = drivers.find((d) => d.name === e.target.value);
              setOrderData({
                ...orderData,
                driverName: selectedDriver.name,
                driverPhone: selectedDriver.phone,
              });
            }}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select Driver</MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.name} value={driver.name}>{driver.name}</MenuItem>
            ))}
          </Select>

          <TextField
            label="Driver Phone"
            name="driverPhone"
            value={orderData.driverPhone}
            fullWidth
            disabled
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "16px" }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button color="primary" variant="contained">
          Save Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewOrderModal;
