import React, { useMemo, useState } from "react";
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
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DriverAutocomplete from "./DriverSelectorBox";
import UserAutocompleteFields from "./AddNewUser";

const locationList = ["New York", "Los Angeles", "Chicago", "Houston"];

const AddNewOrderModal = ({ onClose, ordermetadata }) => {
  console.log("data:-", ordermetadata);

  const userlocation = ordermetadata?.userLoction
    ? Array.isArray(ordermetadata.userLoction)
      ? ordermetadata.userLoction
      : [ordermetadata.userLoction]
    : [];




  const alldrivers = ordermetadata.drivers || [];
  const driverInfo = alldrivers.map((driver) => ({
    name: driver.name,
    phoneNumber: driver.phoneNumber,
  }));

  const alltrucks = ordermetadata.trucks || [];

  const [orderData, setOrderData] = useState({
    date: new Date().toISOString().split("T")[0],
    consignmentNo: "",
    consigner: "",
    consignee: "",
    consignergstin: "",
    consigneegstin: "",
    consignerId: "",
    consigneeId: "",
    from: "",
    to: "",
    truckNumber: "",
    driverName: "",
    driverPhone: "",
    items: "",
    gst: "",
    totalrate: "",
    freight: "",
    gstType: "",
    igst: "",
    sgst: "",
    cgst: "",
    amount: "",
    totalAmount: "",
  });
  const [newCustomer, setNewCustomer] = useState(null)
  const users = useMemo(() => {
    const baseCustomers = ordermetadata?.customers || [];
    return newCustomer ? [...baseCustomers, newCustomer] : [...baseCustomers];
  }, [ordermetadata, newCustomer]);
  const handleCustomer = (value, type, isNew) => {
    isNew && setNewCustomer(value)
    console.log(value, type)
    if (type === "consigner") {
      setOrderData((prev) => ({
        ...prev,
        consigner: value?.name || "",
        consignerId: value?.id || "",
        consignergstin: value?.gstin || "",
      }))
    } else {
      setOrderData((prev) => ({
        ...prev,
        consignee: value?.name || "",
        consigneeId: value?.id || "",
        consigneegstin: value?.gstin || "",
      }))
    }
  }
  console.log(orderData)
  const [orderItems, setOrderItems] = useState([
    { itemName: "", weight: "", unit: "", amount: "", qnt: "", rate: "" },
  ]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { itemName: "", weight: "", unit: "", amount: "", qnt: "", rate: "" },
    ]);
  };

  const handleOrderItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];

    // Parse value for numeric fields
    if (["qnt", "rate"].includes(field)) {
      updatedItems[index][field] = parseFloat(value) || "";
    } else {
      updatedItems[index][field] = value;
    }

    const qnt = parseFloat(updatedItems[index].qnt);
    const rate = parseFloat(updatedItems[index].rate);

    if (!isNaN(qnt) && !isNaN(rate)) {
      updatedItems[index].amount = (qnt * rate).toFixed(2);
    } else {
      updatedItems[index].amount = "";
    }

    setOrderItems(updatedItems);
  };


  const deleteOrderItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const gstOptions = [
    { value: "igst", label: "IGST" },
    { value: "sgst_cgst", label: "SGST + CGST" },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open
      sx={{
        width: 750,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 750, zIndex: 1200 },
      }}
    >
      <TextField
        size="small"
        sx={{ width: "30%", marginTop: 2, paddingX: 2 }}
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
          paddingX: 2,
          paddingTop: 2,
        }}
      >
        <UserAutocompleteFields
          users={users}
          name="consigner"
          value={orderData.consignerId}
          setValue={handleCustomer}
        />
        <UserAutocompleteFields
          users={users}
          name="consignee"
          value={orderData.consigneeId}
          setValue={handleCustomer}
        />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          padding: 2,
        }}
      >
        <TextField
          label="GSTIN"
          name="consignergstin"
          value={orderData.consignergstin}
          size="small"
          aria-readonly
        />
        <TextField
          label="GSTIN"
          name="consigneegstin"
          value={orderData.consigneegstin}
          size="small"
          aria-readonly
        />
        <TextField
          label="From Location"
          size="small"
          fullWidth
          value={orderData.from || ordermetadata?.userLoction || ""}
          onChange={(e) => setOrderData({ ...orderData, from: e.target.value })}
          disabled
        />

        <Autocomplete
          size="small"
          options={userlocation}
          renderInput={(params) => (
            <TextField {...params} label="To Location" fullWidth />
          )}
          onChange={(e, value) => setOrderData({ ...orderData, to: value })}
        />
        <Box sx={{ display: "flex", gap: 2, gridColumn: "span 2" }}>
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
            {alltrucks.map((truck, idx) => (
              <MenuItem key={idx} value={truck.truckNumber}>
                {truck.truckNumber}
              </MenuItem>
            ))}
          </Select>
          <DriverAutocomplete
            driverInfo={driverInfo}
            setOrderData={setOrderData}
            orderData={orderData}
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
            />
            <TextField
              size="small"
              label="Weight"
              value={item.weight}
              onChange={(e) =>
                handleOrderItemChange(index, "weight", e.target.value)
              }
              sx={{ flex: .5 }}
            />
            <FormControl size="small" sx={{ flex: 0.4 }}>
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
              label="Qnt"
              value={item.qnt}
              onChange={(e) =>
                handleOrderItemChange(index, "qnt", e.target.value)
              }
              sx={{ flex: .5 }}
            />
            <TextField
              size="small"
              label="Rate"
              value={item.rate}
              onChange={(e) =>
                handleOrderItemChange(index, "rate", e.target.value)
              }
              sx={{ flex: .5 }}
            />
            <TextField
              size="small"
              label="Amount"
              value={item.amount}
              onChange={(e) =>
                handleOrderItemChange(index, "amount", e.target.value)
              }
              sx={{ flex: .6 }}
            />
            {orderItems.length > 1 && (
              <IconButton
                onClick={() => deleteOrderItem(index)}
                color="error"
                sx={{ px: 0 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
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
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl sx={{ minWidth: 160 }} size="small">
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
              sx={{ width: 140 }}
            />
          </Box>
          <Box display="flex" flexDirection="row" gap={2}>
            <TextField
              label="Total Amount"
              name="totalAmount"
              value={orderData.totalAmount}
              onChange={handleChange}
              size="small"
              sx={{ width: 160 }}
            />
            <TextField
              label="Freight"
              name="freight"
              value={orderData.freight}
              onChange={handleChange}
              size="small"
              sx={{ width: 160 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Bottom Actions */}
      <DialogActions sx={{ px: 2, py: 2 }}>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Submit Order
        </Button>
      </DialogActions>
    </Drawer>
  );
};

export default AddNewOrderModal;
