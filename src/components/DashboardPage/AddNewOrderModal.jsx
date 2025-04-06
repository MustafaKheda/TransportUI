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
  FormControl,
  InputLabel,
  Grid,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const consignerList = ["ABC Logistics", "XYZ Transport", "PQR Shipping"];
const consigneeList = ["DEF Enterprises", "LMN Distributors", "STU Retailers"];
const locationList = ["New York", "Los Angeles", "Chicago", "Houston"];
const truckNumbers = ["TN-001", "TN-002", "TN-003"];

const initialDrivers = [
  { name: "John Doe", phone: "9876543210" },
  { name: "Jane Smith", phone: "8765432109" },
  { name: "Mike Johnson", phone: "7654321098" },
];

const AddNewOrderModal = ({ onClose }) => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [showAddDriver, setShowAddDriver] = useState(false);

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
  const [orderItems, setOrderItems] = useState([
    { itemName: "", weight: "", unit: "", amount: "" },
  ]);
  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { itemName: "", weight: "", unit: "", amount: "" },
    ]);
  };
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
  const gstOptions = [
    { value: "igst", label: "IGST" },
    { value: "sgst_cgst", label: "SGST + CGST" },
  ];
  const handleOrderItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    setOrderItems(updatedItems);
  };
  const deleteOrderItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
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
      <TextField
        size="small"
        sx={{
          width: "30%",
          marginTop: 2,
          paddingX: 2,
        }}
        label="Date"
        type="date"
        name="date"
        value={orderData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          padding: 2,
        }}
      >

        <Autocomplete
          size="small"
          options={consignerList}
          renderInput={(params) => (
            <TextField {...params} label="Consigner" fullWidth />
          )}
          onChange={(event, newValue) =>
            setOrderData({ ...orderData, consigner: newValue })
          }
        />
        <Autocomplete
          size="small"
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
          size="small"
        />
        <TextField
          label="GSTIN"
          name="consigneegstin"
          value={orderData.consigneegstin}
          onChange={handleChange}
          size="small"
        />

        <Autocomplete
          size="small"
          options={locationList}
          renderInput={(params) => (
            <TextField {...params} label="From Location" fullWidth />
          )}
          onChange={(event, newValue) =>
            setOrderData({ ...orderData, from: newValue })
          }
        />
        <Autocomplete
          size="small"
          options={locationList}
          renderInput={(params) => (
            <TextField {...params} label="To Location" fullWidth />
          )}
          onChange={(event, newValue) =>
            setOrderData({ ...orderData, to: newValue })
          }
        />


        {/* Truck, Driver Name, and Driver Phone in one line */}
        <Box sx={{ display: "flex", gap: 2, gridColumn: "span 2" }}>
          {/* Truck Number */}
          <Select
            size="small"
            name="truckNumber"
            value={orderData.truckNumber}
            onChange={handleChange}
            displayEmpty
            fullWidth
            sx={{ flex: 1 }}
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

          {/* Driver Name */}
          <Select
            size="small"
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
            sx={{ flex: 1 }}
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

          {/* Driver Phone */}
          <TextField
            size="small"
            label="Driver Phone"
            name="driverPhone"
            value={orderData.driverPhone}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>
      <Box sx={{ px: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Order Items
        </Typography>

        {orderItems.map((item, index, array) => (
          <Box
            key={index}
            sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}
          >
            <TextField
              size="small"
              label="Item Name"
              value={item.itemName}
              onChange={(e) =>
                handleOrderItemChange(index, "itemName", e.target.value)
              }
              sx={{ flex: 2 }}
            />
            <TextField
              size="small"
              label="Weight"
              value={item.weight}
              onChange={(e) =>
                handleOrderItemChange(index, "weight", e.target.value)
              }
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                value={item.unit}
                onChange={(e) =>
                  handleOrderItemChange(index, "unit", e.target.value)
                }
                label="Unit"
              >
                <MenuItem value="KG">KG</MenuItem>
                <MenuItem value="LITER">LITER</MenuItem>
                <MenuItem value="PER UNIT">PER UNIT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Amount"
              value={item.amount}
              onChange={(e) =>
                handleOrderItemChange(index, "amount", e.target.value)
              }
              sx={{ flex: 1 }}
            />
            {array.length > 1 && <IconButton
              onClick={() => deleteOrderItem(index)}
              color="error"
              sx={{ px: 0 }}
            >
              <DeleteIcon />
            </IconButton>}
          </Box>

        ))}

        <Button
          variant="outlined"
          onClick={addOrderItem}
          size="small"
          sx={{ mt: 1 }}
        >
          + Add Item
        </Button>
      </Box>
      <Box sx={{ px: 2, mt: 4 }}>
        {/* Aligned Bottom Fields */}
        <Grid mt={2}
          container
          spacing={1}
        >
          <Grid container item size={9} spacing={1} gap={1}>

            <Grid item size={12} display={"flex"} gap={1}>
              {/* GST Type */}
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>GST Type</InputLabel>
                <Select
                  size="small"
                  name="gstType"
                  value={orderData.gstType}
                  onChange={handleChange}
                  label="GST Type"
                >
                  {gstOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* GST Inputs */}
              {orderData.gstType === "igst" ? (
                <TextField
                  label="IGST %"
                  name="igst"
                  value={orderData.igst}
                  onChange={handleChange}
                  size="small"
                  sx={{ width: 120 }}
                />
              ) : (
                <>
                  <TextField
                    label="SGST %"
                    name="sgst"
                    value={orderData.sgst}
                    onChange={handleChange}
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <TextField
                    label="CGST %"
                    name="cgst"
                    value={orderData.cgst}
                    onChange={handleChange}
                    size="small"
                    sx={{ width: 120 }}
                  />
                </>
              )}
              <TextField
                label="GST Amount"
                name="amount"
                value={orderData.amount}
                onChange={handleChange}
                size="small"
                sx={{ width: 120 }}
              />
            </Grid>
            {/* Freight */}
            <TextField
              label="Freight"
              name="freight"
              value={orderData.freight}
              onChange={handleChange}
              size="small"
              sx={{ width: 150 }}
            />
          </Grid>
          {/* Total Amount */}
          <Grid item size={3}>
            <TextField
              label="Total Amount"
              name="totalAmount"
              value={orderData.totalAmount}
              onChange={handleChange}
              size="small"
              sx={{ width: 150 }}
            />
          </Grid>
        </Grid>
      </Box>

      <DialogActions sx={{ padding: "16px" }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button color="primary" variant="contained">
          Save Order
        </Button>
      </DialogActions>
    </Drawer >
  );
};

export default AddNewOrderModal;