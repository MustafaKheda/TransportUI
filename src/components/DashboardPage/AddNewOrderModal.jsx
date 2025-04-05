import React, { useState } from "react";
import {
  Drawer,
  Button,
  Box,
  DialogActions,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
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

const AddNewOrderModal = ({ onClose }) => {
  const [orderData, setOrderData] = useState({
    date: new Date().toISOString().split("T")[0],
    consignmentNo: "",
    consigner: "",
    consignee: "",
    consignergstin: "",
    consigneegstin: "",
    from: "",
    to: "",
    truckNumber: "",
    driverName: "",
    driverPhone: "",
    items: "",
    gst: "",
    totalrate: "",
    freight: "",
  });

  const orders = [
    {
      orderId: "001",
      customerName: "Order A",
      pickup: "Delhi",
      dropoff: "Mumbai",
      items: 10,
      trucknum: "DL06IN2025",
      amount: 10000,
    },
    {
      orderId: "002",
      customerName: "Order B",
      pickup: "Delhi",
      dropoff: "Mumbai",
      items: 10,
      trucknum: "DL06IN2025",
      amount: 10000,
    },
    {
      orderId: "003",
      customerName: "Order C",
      pickup: "Delhi",
      dropoff: "Mumbai",
      items: 10,
      trucknum: "DL06IN2025",
      amount: 10000,
    },
  ];

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      elevation={5}
      open
      sx={{
        width: 750,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 750, zIndex: 1200 },
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          marginTop: 2,
          padding: 2,
        }}
      >
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
          label="ORD NO"
          name="consignmentNo"
          value={orderData.consignmentNo}
          onChange={handleChange}
          fullWidth
        />

        {/* Consigner & Consignee */}
        <Autocomplete
          options={consignerList}
          renderInput={(params) => (
            <TextField {...params} label="Consigner" fullWidth />
          )}
          onChange={(event, newValue) =>
            setOrderData({ ...orderData, consigner: newValue })
          }
        />
        <Autocomplete
          options={consigneeList}
          renderInput={(params) => (
            <TextField {...params} label="Consignee" fullWidth />
          )}
          onChange={(event, newValue) =>
            setOrderData({ ...orderData, consignee: newValue })
          }
        />
        <TextField
          label="GSTIN"
          name="consignergstin"
          value={orderData.consignergstin}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="GSTIN"
          name="consigneegstin"
          value={orderData.consigneegstin}
          onChange={handleChange}
          fullWidth
        />

        {/* From & To Locations */}
        <Autocomplete
          options={locationList}
          renderInput={(params) => (
            <TextField {...params} label="From Location" fullWidth />
          )}
          onChange={(event, newValue) =>
            setOrderData({ ...orderData, from: newValue })
          }
        />
        <Autocomplete
          options={locationList}
          renderInput={(params) => (
            <TextField {...params} label="To Location" fullWidth />
          )}
          onChange={(event, newValue) =>
            setOrderData({ ...orderData, to: newValue })
          }
        />

        {/* Truck Number */}
        <Select
          name="truckNumber"
          value={orderData.truckNumber}
          onChange={handleChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select Truck
          </MenuItem>
          {truckNumbers.map((truck) => (
            <MenuItem key={truck} value={truck}>
              {truck}
            </MenuItem>
          ))}
        </Select>

        {/* Driver Name & Driver Phone */}
        <Select
          name="driverName"
          value={orderData.driverName}
          onChange={(e) => {
            const selectedDriver = drivers.find(
              (d) => d.name === e.target.value
            );
            setOrderData({
              ...orderData,
              driverName: selectedDriver.name,
              driverPhone: selectedDriver.phone,
            });
          }}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select Driver
          </MenuItem>
          {drivers.map((driver) => (
            <MenuItem key={driver.name} value={driver.name}>
              {driver.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Driver Phone"
          name="driverPhone"
          value={orderData.driverPhone}
          fullWidth
        />
        <TextField
          label="Items"
          name="Items"
          value={orderData.items}
          fullWidth
        />
        <Button onClick={onClose} color="secondary" variant="outlined">
          Add Item
        </Button>
      </Box>
      <Box sx={{ px: 2, mt: 4 }}>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Weight</strong>
                </TableCell>
                <TableCell>
                  <strong>Per Unit</strong>
                </TableCell>
                <TableCell>
                  <strong>Rate</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.pickup}</TableCell>
                  <TableCell>{order.dropoff}</TableCell>
                  <TableCell>{order.items}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Aligned Bottom Fields */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 2,
            mt: 3,
          }}
        >
          <TextField
            label="GST %"
            name="gst"
            value={orderData.gst}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Total Rate"
            name="totalrate"
            value={orderData.totalrate}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Freight"
            name="freight"
            value={orderData.freight}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </Box>

      {/* Menu List */}
      <DialogActions sx={{ padding: "16px" }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button color="primary" variant="contained">
          Save Order
        </Button>
      </DialogActions>
    </Drawer>
  );
};

export default AddNewOrderModal;
