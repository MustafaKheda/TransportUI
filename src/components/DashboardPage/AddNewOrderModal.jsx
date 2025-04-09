import React, { useEffect, useMemo, useState } from "react";
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
import { api } from "../../api/apihandler";
import { generatePDF } from "../../utils/Pdf";
const data = {
  branch: {
    name: "Main Branch",
    location: "City Center",
    address: "123 Main St",
    contact: "9876543210",
    gstin: "29ABCDE1234F2Z5"
  },
  orderInfo: {
    createdAt: "2025-04-09",
    orderNumber: "INV-00123",
    pickup: "Warehouse A",
    dropoff: "Shop B"
  },
  customer: {
    consignor: {
      name: "John Doe",
      address: "123 Sender St",
      gstin: "22AAAAA0000A1Z5",
      contact: "9999988888"
    },
    consignee: {
      name: "Jane Smith",
      address: "456 Receiver Ave",
      gstin: "33BBBBB1111B2Z6",
      contact: "7777766666"
    }
  },
  truck: {
    number: "MH12AB1234",
    driver: "Ramesh",
    phone: "8888888888"
  },
  items: [
    { name: "Item A", weight: "50", unit: "kg", quantity: 2, rate: 100, amount: 200 },
    { name: "Item B", weight: "20", unit: "kg", quantity: 1, rate: 150, amount: 150 }
  ],
  invoice: {
    freight: 350,
    gst: 63,
    extraCharge: 20,
    totalAmount: 433,
    advance: 100,
    balance: 333
  }
};
const AddNewOrderModal = ({ onClose, ordermetadata }) => {
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

  const alltrucks = ordermetadata.trucks?.map((item) => item.truckNumber) || [];
  console.log(alltrucks)
  const [orderData, setOrderData] = useState({
    date: new Date().toISOString().split("T")[0],
    consigner: "",
    consignee: "",
    consignergstin: "",
    consigneegstin: "",
    consignorId: "",
    consigneeId: "",
    pickupLocation: ordermetadata?.userLoction || "",
    dropoffLocation: "",
    truckNumber: "",
    driverName: "",
    driverPhone: "",
  });
  const [formErrors, setFormErrors] = useState({})
  const [invoice, setInvoice] = useState({
    gst: 0,
    gstType: "igst",
    igst: 0,
    sgst: 0,
    cgst: 0,
    amount: 0,
    freight: 0,
    extraCharge: 0,
    advance: 0,
    totalAmount: 0,
    balance: 0,
  })
  const [newCustomer, setNewCustomer] = useState(null)
  const [orderItems, setOrderItems] = useState([
    { itemName: "", weight: 0, unit: "", amount: 0, qnt: 0, rate: 0 },
  ]);
  const users = useMemo(() => {
    const baseCustomers = ordermetadata?.customers || [];
    return newCustomer ? [...baseCustomers, newCustomer] : [...baseCustomers];
  }, [ordermetadata, newCustomer]);
  const handleCustomer = (value, type, isNew) => {
    isNew && setNewCustomer(value)
    if (type === "consignor") {
      setOrderData((prev) => ({
        ...prev,
        consigner: value?.name || "",
        consignorId: value?.id || "",
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
  const handleClose = (isCreated = false) => {
    setOrderData({
      consigner: "",
      consignee: "",
      consignergstin: "",
      consigneegstin: "",
      consignorId: "",
      consigneeId: "",
      pickupLocation: "",
      dropoffLocation: "",
      truckNumber: "",
      driverName: "",
      driverPhone: "",
    })
    setOrderItems([{ itemName: "", weight: 0, unit: "", amount: 0, qnt: 0, rate: 0 }])
    setInvoice({
      gst: 0,
      gstType: "igst",
      igst: 0,
      sgst: 0,
      cgst: 0,
      amount: 0,
      freight: 0,
      extraCharge: 0,
      advance: 0,
      totalAmount: 0,
      balance: 0,
    })
    onClose(isCreated)
  }


  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleInvoiceChange = (e) => {
    setInvoice((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (e.target.name === "advance") {
      const advance = parseFloat(e.target.value) || 0
      setInvoice((prev) => ({
        ...prev,
        balance: prev.totalAmount - advance
      }))
    }
  }

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { itemName: "", weight: 0, unit: "", amount: 0, qnt: 0, rate: 0 },
    ]);
  };

  useEffect(() => {
    const itemsTotal = orderItems.reduce((total, item) => {
      const amount = parseFloat(item.amount);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);

    setInvoice((prev) => ({
      ...prev,
      amount: itemsTotal,
    }));
  }, [orderItems]);

  useEffect(() => {
    const baseAmount = parseFloat(invoice.amount) || 0;
    const freight = parseFloat(invoice.freight) || 0;
    const extraCharge = parseFloat(invoice.extraCharge) || 0
    const advance = parseFloat(invoice.advance) || 0

    let gstValue = 0;
    if (invoice.gstType === "igst") {
      gstValue = baseAmount * (parseFloat(invoice.igst) || 0) / 100;
    } else {
      const sgst = baseAmount * (parseFloat(invoice.sgst) || 0) / 100;
      const cgst = baseAmount * (parseFloat(invoice.cgst) || 0) / 100;
      gstValue = sgst + cgst;
    }

    setInvoice((prev) => ({
      ...prev,
      gst: gstValue,
      totalAmount: (baseAmount + freight + gstValue + extraCharge),
      balance: (baseAmount + freight + gstValue + extraCharge - advance),
    }));
  }, [invoice.amount, invoice.freight, invoice.gstType, invoice.igst, invoice.sgst, invoice.cgst, invoice.gst, invoice.extraCharge, invoice.advance]);

  useEffect(() => {
    if (orderData.pickupLocation) return
    setOrderData((prev) => ({
      ...prev,
      pickupLocation: ordermetadata?.userLoction,
    }))
  }, [orderData.pickupLocation, ordermetadata?.userLoction])
  const handleOrderItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    const item = { ...updatedItems[index] };

    if (field === "qnt" || field === "rate") {
      const parsedValue = parseFloat(value);
      item[field] = isNaN(parsedValue) ? "" : parsedValue;

      const qnt = parseFloat(item.qnt);
      const rate = parseFloat(item.rate);

      item.amount = !isNaN(qnt) && !isNaN(rate) ? (qnt * rate).toFixed(2) : "";
    } else {
      item[field] = value;
    }

    updatedItems[index] = item;
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
  const handleValidate = () => {
    const fieldErrors = {};

    // Required fields
    const requiredFields = [
      { key: "consigner", label: "Consigner" },
      { key: "consignee", label: "Consignee" },
      { key: "pickupLocation", label: "Pickup Location" },
      { key: "dropoffLocation", label: "Dropoff Location" },
      { key: "truckNumber", label: "Truck Number" },
      { key: "driverName", label: "Driver Name" },
      { key: "driverPhone", label: "Driver Phone" }
    ];

    requiredFields.forEach(({ key, label }) => {
      if (!orderData[key]?.toString().trim()) {
        fieldErrors[key] = `${label} is required`;
      }
    });

    // // Invoice percentage fields
    // if (invoice.gstType === "igst") {
    //   const igstVal = parseFloat(invoice.igst);
    //   if (isNaN(igstVal) || igstVal < 0 || igstVal > 100) {
    //     fieldErrors["invoice.igst"] = "IGST must be between 0 and 100";
    //   }
    // } else {
    //   const sgstVal = parseFloat(invoice.sgst);
    //   const cgstVal = parseFloat(invoice.cgst);
    //   if (isNaN(sgstVal) || sgstVal < 0 || sgstVal > 100) {
    //     fieldErrors["invoice.sgst"] = "SGST must be between 0 and 100";
    //   }
    //   if (isNaN(cgstVal) || cgstVal < 0 || cgstVal > 100) {
    //     fieldErrors["invoice.cgst"] = "CGST must be between 0 and 100";
    //   }
    // }

    // General invoice numbers
    ["gst", "amount", "freight", "extraCharge", "advance"].forEach((key) => {
      const value = parseFloat(invoice[key]);
      if (isNaN(value) || value < 0) {
        fieldErrors[`invoice.${key}`] = `${key} must be a non-negative number`;
      }
    });

    // Order Items
    if (orderItems.length === 0) {
      fieldErrors["orderItems"] = "At least one order item is required";
    }

    orderItems.forEach((item, index) => {
      if (!item.itemName?.trim()) {
        fieldErrors[`orderItems[${index}].itemName`] = `Item ${index + 1}: Name is required`;
      }
      if (!item.unit?.trim()) {
        fieldErrors[`orderItems[${index}].unit`] = `Item ${index + 1}: Unit is required`;
      }
      if (!item.qnt || item.qnt <= 0) {
        fieldErrors[`orderItems[${index}].qnt`] = `Item ${index + 1}: Quantity must be > 0`;
      }
      if (!item.rate || item.rate <= 0) {
        fieldErrors[`orderItems[${index}].rate`] = `Item ${index + 1}: Rate must be > 0`;
      }
    });

    // Handle errors
    if (Object.keys(fieldErrors).length > 0) {
      console.log("Field errors:", fieldErrors);
      // Optional: Set in state to display in UI
      setFormErrors(fieldErrors);
      return true;
    }
    return false
  }

  const handleSubmit = async () => {
    if (handleValidate()) return

    // ✅ If no errors, proceed
    const payload = {
      ...orderData,
      driver: {
        name: orderData.driverName.trim(),
        phoneNumber: orderData.driverPhone.trim(),
      },
      invoice: {
        ...invoice,
        gstType: invoice.gst > 0 ? invoice.gstType : null,
        gstRate: invoice.gst > 0 ? invoice.gstType === "igst" ? parseInt(invoice.igst) : parseInt(invoice.sgst) + parseInt(invoice.cgst) : null
      },
      orderItems
    };
    try {
      console.log("Validated Payload", payload);
      const response = await api.post("/orders", { ...payload })
      console.log(response)
      if (response.status === 201) {
        // handleClose(true)
        alert("Order Saved")
        return true
      }
    } catch (error) {
      console.error(error, "error while creating order")
      return false
    }


    // Send payload to server
  };
  const handleDownloadPDF = async () => {
    // const isSave = await handleSubmit();
    // if (isSave) {

    generatePDF(data)
    // }
  }

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
          name="consignor"
          value={orderData.consignorId}
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
          value={orderData?.pickupLocation || ""}
          // onChange={(e) => setOrderData({ ...orderData, pickupLocation: e.target.value })}
          InputProps={{ readOnly: true }}
        />

        <Autocomplete
          size="small"
          freeSolo
          options={ordermetadata?.locationList}
          renderInput={(params) => (
            <TextField {...params} label="To Location" fullWidth />
          )}
          onInputChange={(e, value) => {
            console.log(e.target, value)
            setOrderData({ ...orderData, dropoffLocation: value })
          }}

          onChange={(e, value) => {
            console.log(e.target, value)
            setOrderData({ ...orderData, dropoffLocation: value })
          }}
        />
        <Box sx={{ display: "flex", gap: 2, gridColumn: "span 2" }}>
          <Autocomplete
            size="small"
            freeSolo
            options={alltrucks}
            sx={{ flex: 1, minWidth: 170 }}
            renderInput={(params) => (
              <TextField {...params} label="Truck Number" fullWidth />
            )}
            onInputChange={(e, value) => {
              console.log(e.target, value)
              setOrderData({ ...orderData, truckNumber: value })
            }}
            onChange={(e, value) => {
              console.log(e.target, value)
              setOrderData({ ...orderData, truckNumber: value })
            }}
          />
          {/* <Select
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
          </Select> */}
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
                <MenuItem value="UNIT">PER UNIT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Qty"
              value={item.qnt}
              onChange={(e) =>
                handleOrderItemChange(index, "qnt", e.target.value)
              }
              sx={{ flex: .3 }}
            />
            <TextField
              size="small"
              label="Rate"
              value={item.rate}
              onChange={(e) =>
                handleOrderItemChange(index, "rate", e.target.value)
              }
              sx={{ flex: .3 }}
            />
            <TextField
              size="small"
              label="Amount"
              value={item.amount}
              onChange={(e) =>
                handleOrderItemChange(index, "amount", e.target.value)
              }
              sx={{ flex: .4 }}
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

      <Box display="flex" px={2} flexDirection="column" alignItems={"end"} gap={2}>
        <TextField
          label="Freight"
          name="freight"
          value={invoice.freight}
          onChange={handleInvoiceChange}
          size="small"
          sx={{ width: 160 }}
          type="number"
        />
        <TextField
          label="Extra Charge"
          name="extraCharge"
          value={invoice.extraCharge}
          onChange={handleInvoiceChange}
          size="small"
          sx={{ width: 160 }}
          type="number"
        />


        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel>GST Type</InputLabel>
            <Select
              size="small"
              name="gstType"
              value={invoice.gstType}
              onChange={handleInvoiceChange}
              label="GST Type"
            >
              {gstOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {invoice.gstType === "igst" ? (
            <TextField
              label="IGST %"
              name="igst"
              value={invoice.igst}
              onChange={handleInvoiceChange}
              size="small"
              sx={{ width: 60 }}
              type="number"

            />
          ) : (
            <>
              <TextField
                label="SGST %"
                name="sgst"
                value={invoice.sgst}
                onChange={handleInvoiceChange}
                size="small"
                sx={{ width: 60 }}
                type="number"
              />
              <TextField
                label="CGST %"
                name="cgst"
                value={invoice.cgst}
                onChange={handleInvoiceChange}
                size="small"
                sx={{ width: 60 }}
                type="number"
              />
            </>
          )}
          <TextField
            label="GST Amount"
            name="gst"
            value={invoice.gst}
            onChange={handleInvoiceChange}
            size="small"
            sx={{ width: 140 }}
          />
        </Box>


        <TextField
          label="Advance"
          name="advance"
          value={invoice.advance}
          onChange={handleInvoiceChange}
          size="small"
          sx={{ width: 160 }}
        />
        <TextField
          label="Balance"
          name="balance"
          value={invoice.balance}
          size="small"
          onChange={handleInvoiceChange}
          sx={{ width: 160 }}
        />

      </Box>


      {/* Bottom Actions */}
      <DialogActions sx={{ px: 2, py: 2, mt: "auto" }} >
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={handleDownloadPDF} variant="contained" color="primary">
          Save And Download
        </Button>

      </DialogActions>
    </Drawer>
  );
};

export default AddNewOrderModal;
