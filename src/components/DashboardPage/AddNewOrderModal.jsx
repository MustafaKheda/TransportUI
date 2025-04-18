import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { generatePDF, printPdf } from "../../utils/Pdf";
const AddNewOrderModal = ({ onClose, ordermetadata }) => {
  const itemNameRefs = useRef([]);
  const consignerRef = useRef(null);
  const alldrivers = ordermetadata.drivers || [];
  const driverInfo = alldrivers.map((driver) => ({
    name: driver.name,
    phoneNumber: driver.phoneNumber,
  }));
  const [orderData, setOrderData] = useState({
    date: new Date().toISOString().split("T")[0],
    consignor: "",
    consignee: "",
    consignorgstin: "",
    consigneegstin: "",
    consignorId: "",
    consigneeId: "",
    pickupLocation: ordermetadata?.userLoction || "",
    dropoffLocation: "",
    truckNumber: "",
    driverName: "",
    driverPhone: "",
  });
  const [savedOrder, setSavedOrder] = useState(null);
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

  const alltrucks = useMemo(() => {
    const trucks = new Set(ordermetadata.trucks?.map(item => item.truckNumber));
    if (savedOrder?.order?.truck?.truckNumber) {
      trucks.add(savedOrder.order?.truck?.truckNumber);
    }
    console.log(trucks)
    return Array.from(trucks);
  }, [ordermetadata.trucks, savedOrder]);

  useEffect(() => {
    if (itemNameRefs.current.length > 0) {
      const lastRef = itemNameRefs.current[orderItems.length - 1];
      lastRef?.focus();
    }
  }, [orderItems.length]);
  const handleCustomer = (value, type, isNew) => {
    isNew && setNewCustomer(value)

    if (type === "consignor") {
      setFormErrors({ ...formErrors, ["consignor"]: null })
      setOrderData((prev) => ({
        ...prev,
        consignor: value?.name || "",
        consignorId: value?.id || "",
        consignorgstin: value?.gstin || "",
      }))
    } else {
      setFormErrors({ ...formErrors, ["consignee"]: null })
      setOrderData((prev) => ({
        ...prev,
        consignee: value?.name || "",
        consigneeId: value?.id || "",
        consigneegstin: value?.gstin || "",
      }))
    }
  }

  const handleClose = (isCreated = false) => {
    resetForm()
    onClose(isCreated)
    setFormErrors({})
  }


  const handleChange = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: null })
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target
    const numericValue = parseFloat(value)
    setFormErrors({ ...formErrors, [e.target.name]: null })
    // Block negative values
    if (numericValue < 0) return

    setInvoice((prev) => {
      const updatedInvoice = {
        ...prev,
        [name]: value
      }

      if (name === "advance") {
        updatedInvoice.balance = prev.totalAmount - numericValue
      }

      return updatedInvoice
    })
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
    setFormErrors(prev => ({ ...prev, [`orderItems[${index}].${field}`]: null }));

    setOrderItems(prevItems => {
      const updatedItems = [...prevItems];
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
      return updatedItems;
    });
  };


  const deleteOrderItem = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };
  const resetForm = () => {
    setOrderData({
      consignor: "",
      consignee: "",
      consignorgstin: "",
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
  };
  const gstOptions = [
    { value: "igst", label: "IGST" },
    { value: "sgst_cgst", label: "SGST + CGST" },
  ];
  const handleValidate = useCallback(() => {
    const fieldErrors = {};

    // Required fields
    const requiredFields = [
      { key: "consignor", label: "Consignor" },
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
        fieldErrors[`orderItems[${index}].itemName`] = `Name is required`;
      }
      if (!item.unit?.trim()) {
        fieldErrors[`orderItems[${index}].unit`] = `Unit is required`;
      }
      if (!item.qnt || item.qnt <= 0) {
        fieldErrors[`orderItems[${index}].qnt`] = `must be > 0`;
      }
      if (!item.rate || item.rate <= 0) {
        fieldErrors[`orderItems[${index}].rate`] = `Rate must be > 0`;
      }
    });

    // Handle errors
    if (Object.keys(fieldErrors).length > 0) {
      // Optional: Set in state to display in UI
      setFormErrors(fieldErrors);
      return true;
    }
    return false
  }, [orderData, orderItems, invoice])

  const handleSubmit = async (print = false) => {
    if (savedOrder && print) {
      console.log()
      return { error: false, savedOrder }
    }
    if (handleValidate()) return { error: true, savedOrder: false }

    // ✅ If no errors, proceed
    const payload = {
      ...orderData,
      driver: {
        name: orderData.driverName.trim(),
        phoneNumber: orderData.driverPhone.trim(),
      },
      invoice: {
        ...invoice,
        gstType: invoice.gst > 0 ? invoice.gstType : '',
        gstRate: invoice.gst > 0 ? invoice.gstType === "igst" ? parseInt(invoice.igst) : parseInt(invoice.sgst) + parseInt(invoice.cgst) : ''
      },
      orderItems
    };

    try {
      console.log("Validated Payload", payload);
      setSavedOrder(null)
      const response = await api.post(`/orders?print=${print}`, payload, print ? { responseType: 'blob' } : {})
      if (print) {
        return { error: false, savedOrder: response.data }
      }
      setSavedOrder(response.data);
      console.log(response)
      if (response.status === 201) {
        // handleClose(true)
        consignerRef.current?.focus();
        resetForm();
        alert("Order Saved")
        return response.data
      }
    } catch (error) {
      console.error(error, "error while creating order")
      return false
    }


    // Send payload to server
  };
  const handleSaveAndDownload = async () => {
    try {
      const { error, savedOrder: pdfBlob } = await handleSubmit(true); // Get the PDF blob directly
      console.log(pdfBlob, error)
      if (!error && !pdfBlob) {
        alert('Failed to generate PDF');
        return;
      }

      const pdfUrl = URL.createObjectURL(pdfBlob);
      printPdf(pdfUrl); // or trigger download
      setSavedOrder(null);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  const handleDownloadPDF = async () => {
    try {
      if (!savedOrder) {
        alert("Failed to save order. Cannot generate PDF.");
        return;
      }
      const id = savedOrder.order.id
      const response = await api.get(`/orders/pdf/${id}`, { responseType: 'blob' });
      console.log(response, "pdf")
      const pdfBlob = response.data;
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl)
      printPdf(pdfUrl);
      setSavedOrder(null)
    } catch (error) {
      console.error(error)
    }
    // if (isSave) {

    // }
  }
  const getError = (key) => formErrors[key] || ""
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open
      sx={{
        // width: "100%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "80%",
          zIndex: 1200,
          backgroundColor: "white",
        },
      }}>
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
        }}>
        <UserAutocompleteFields
          users={users}
          name="consignor"
          value={orderData.consignorId}
          setValue={handleCustomer}
          inputRef={consignerRef}
          error={!!getError("consignor")}
          helperText={getError("consignor")}
        />
        <UserAutocompleteFields
          users={users}
          name="consignee"
          value={orderData.consigneeId}
          setValue={handleCustomer}
          error={!!getError("consignee")}
          helperText={getError("consignee")}
        />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          padding: 2,
        }}>
        <TextField
          label="GSTIN"
          name="consignorgstin"
          value={orderData.consignorgstin}
          size="small"
          aria-readonly
          slotProps={{
            htmlInput: { readOnly: true, tabIndex: -1 }
          }}
        />
        <TextField
          label="GSTIN"
          name="consigneegstin"
          value={orderData.consigneegstin}
          size="small"
          aria-readonly
          slotProps={{
            htmlInput: { readOnly: true, tabIndex: -1 }
          }}
        />
        <TextField
          label="From Location"
          size="small"
          fullWidth
          value={orderData?.pickupLocation || ""}
          aria-readonly
          // onChange={(e) => setOrderData({ ...orderData, pickupLocation: e.target.value })}
          // InputProps={{
          //   readOnly: true,
          //   inputProps: {
          //     tabIndex: -1,
          //   },
          // }}
          slotProps={{
            htmlInput: { readOnly: true, tabIndex: -1 }
          }}
        />

        <Autocomplete
          size="small"
          freeSolo
          value={orderData.dropoffLocation}
          options={ordermetadata?.locationList}
          renderInput={(params) => (
            <TextField {...params} label="To Location" fullWidth error={!!getError("dropoffLocation")}
              helperText={getError("dropoffLocation")} />
          )}
          onInputChange={(e, value) => {
            setFormErrors({ ...formErrors, dropoffLocation: null })
            setOrderData({ ...orderData, dropoffLocation: value })
          }}
          onChange={(e, value) => {
            setFormErrors({ ...formErrors, dropoffLocation: null })
            setOrderData({ ...orderData, dropoffLocation: value })
          }}
        />
        <Box sx={{ display: "flex", gap: 2, gridColumn: "span 2" }}>
          <Autocomplete
            size="small"
            freeSolo
            value={orderData.truckNumber}
            options={alltrucks}
            sx={{ flex: 1, minWidth: 170 }}
            renderInput={(params) => (
              <TextField {...params} error={!!getError("truckNumber")}
                helperText={getError("truckNumber")} label="Truck Number" fullWidth />
            )}
            onInputChange={(e, value) => {

              setFormErrors({ ...formErrors, truckNumber: null })
              setOrderData({ ...orderData, truckNumber: value })
            }}
            onChange={(e, value) => {
              setFormErrors({ ...formErrors, truckNumber: null })
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
            nameError={!!getError("driverName")}
            nameHelperText={getError("driverName")}
            phoneError={!!getError("driverPhone")}
            phoneHelperText={getError("driverPhone")}
            driverInfo={driverInfo}
            setOrderData={setOrderData}
            orderData={orderData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
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
            sx={{ display: "flex", gap: 1, alignItems: "flex-start", mb: 2, minHeight: 60 }}
          >
            <TextField
              inputRef={(el) => (itemNameRefs.current[index] = el)}
              size="small"
              label="Item Name"
              value={item.itemName}
              error={!!getError(`orderItems[${index}].itemName`)}
              helperText={getError(`orderItems[${index}].itemName`)}
              onChange={(e) =>
                handleOrderItemChange(index, "itemName", e.target.value)
              }
            />
            <TextField
              size="small"
              label="Weight"
              value={item.weight}
              error={!!getError(`orderItems[${index}].weight`)}
              helperText={getError(`orderItems[${index}].weight`)}
              onChange={(e) =>
                handleOrderItemChange(index, "weight", e.target.value)
              }
              sx={{ flex: 0.5 }}
            />
            <FormControl size="small" sx={{ flex: 0.4 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                value={item.unit}
                error={!!getError(`orderItems[${index}].unit`)}
                helperText={getError(`orderItems[${index}].unit`)}
                onChange={(e) =>
                  handleOrderItemChange(index, "unit", e.target.value)
                }
                label="Unit">
                <MenuItem selected value="NAG">NAG</MenuItem>
                <MenuItem value="KG">KG</MenuItem>
                <MenuItem value="LITER">LITER</MenuItem>
                <MenuItem value="UNIT">PER UNIT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Qty"
              value={item.qnt}
              error={!!getError(`orderItems[${index}].qnt`)}
              helperText={getError(`orderItems[${index}].qnt`)}
              onChange={(e) =>
                handleOrderItemChange(index, "qnt", e.target.value)
              }
              sx={{ flex: 0.3 }}
            />
            <TextField
              size="small"
              label="Rate"
              value={item.rate}
              error={!!getError(`orderItems[${index}].rate`)}
              helperText={getError(`orderItems[${index}].rate`)}
              onChange={(e) =>
                handleOrderItemChange(index, "rate", e.target.value)
              }
              sx={{ flex: 0.3 }}
            />
            <TextField
              size="small"
              label="Amount"
              value={item.amount}
              onChange={(e) =>
                handleOrderItemChange(index, "amount", e.target.value)
              }
              sx={{ flex: 0.4 }}
              slotProps={{
                htmlInput: { readOnly: true, tabIndex: -1 }
              }}
            />
            {orderItems.length > 1 && (
              <IconButton
                tabIndex={-1}
                onClick={() => deleteOrderItem(index)}
                color="error"
                sx={{ px: 0 }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={addOrderItem}
          size="small"
          sx={{ mt: 1 }}>
          + Add Item
        </Button>
      </Box>

      <Box
        display="flex"
        px={2}
        flexDirection="column"
        alignItems={"end"}
        gap={2}>
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
              tabIndex={-1}
              size="small"
              name="gstType"
              value={invoice.gstType}
              onChange={handleInvoiceChange}
              label="GST Type">
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
          slotProps={{
            htmlInput: { tabIndex: -1 }
          }}
          label="Balance"
          name="balance"
          value={invoice.balance}
          size="small"
          // onChange={handleInvoiceChange}
          sx={{ width: 160 }}
          tabIndex={-1}
        />
      </Box>

      {/* Bottom Actions */}
      <DialogActions sx={{ px: 2, py: 2, mt: "auto" }} >
        <Button onClick={() => handleSubmit(false)} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={savedOrder ? handleDownloadPDF : handleSaveAndDownload} variant="contained" color="primary">
          {savedOrder ? "Print" : "Save And Print"}
        </Button>
        <Button tabIndex={-1} onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Drawer >
  );
};

export default AddNewOrderModal;
