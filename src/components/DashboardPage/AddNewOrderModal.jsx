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
} from "@mui/material";
import AddItem from "./AddItemBox";

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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          marginTop: 2,
          padding: 2,
        }}
      >
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

        {/* Updated Driver Name */}
        <Autocomplete
          freeSolo
          options={drivers.map((d) => d.name)}
          value={orderData.driverName}
          onInputChange={(e, newInputValue) => {
            const exists = drivers.some((d) => d.name === newInputValue);
            setShowAddDriver(!exists && newInputValue !== "");
            setOrderData({ ...orderData, driverName: newInputValue });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Driver Name" fullWidth />
          )}
        />

        <TextField
          label="Driver Phone"
          name="driverPhone"
          value={orderData.driverPhone}
          onChange={(e) => {
            const exists = drivers.some((d) => d.phone === e.target.value);
            setShowAddDriver(!exists && e.target.value !== "");
            setOrderData({ ...orderData, driverPhone: e.target.value });
          }}
          fullWidth
        />

        {showAddDriver && (
          <Box sx={{ gridColumn: "span 2" }}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                if (
                  orderData.driverName &&
                  orderData.driverPhone &&
                  !drivers.some(
                    (d) =>
                      d.name === orderData.driverName ||
                      d.phone === orderData.driverPhone
                  )
                ) {
                  setDrivers([
                    ...drivers,
                    {
                      name: orderData.driverName,
                      phone: orderData.driverPhone,
                    },
                  ]);
                  setShowAddDriver(false);
                }
              }}
            >
              Add New Driver
            </Button>
          </Box>
        )}

        <TextField
          label="Items"
          name="items"
          value={orderData.items}
          onChange={handleChange}
          fullWidth
        />
      </Box>

      <Box sx={{ px: 2 }}>
        <AddItem />
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
