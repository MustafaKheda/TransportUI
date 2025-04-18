import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableRow,
  TableCell,
  CircularProgress,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
import FreeSoloCreateOptionDialog from "../../AutoComplete";
import { api } from "../../api/apihandler";

function RegistrationForm({ order, onClose, managers }) {
  const [orderData, setOrderMetaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branchId: "",
    managerId: null,
    roleId: 3,
  });
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.branchId) {
      errors.branch = "Please select a branch";
    }

    if (!formData.roleId) {
      errors.role = "Role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  console.log(formErrors)
  useEffect(() => {
    if (order) {
      setFormData((prevData) => ({
        ...prevData,
        name: order.customerName, // Prefill customer name
      }));
    }
  }, [order]);

  console.log(formData, " <MenuItem value=");
  const handleChange = (e) => {
    console.log(e.target, "formData");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        roleId: Number(formData.roleId)
      }
      if (!validateForm()) {
        return;
      }
      e.preventDefault();
      setLoading(true);
      const response = await api.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        payload
      );
      console.log(response, "");

      onClose();
    } catch (error) {
      console.log(error.response.data.message, "Error");
      setFormErrors((prev) => ({ ...prev, email: error.response.data.message }))
    } finally {
      setLoading(false);
    }

  };
  const getOrderformData = async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_BASE_URL}/branch`);
      console.log(response, "these are the branches");
      setOrderMetaData(response.data.branches);
    } catch (error) {
      console.log("error consoling:-", error);
    }
  };
  console.log(orderData, "orderData");
  useEffect(() => {
    getOrderformData();
  }, []);

  return (
    <div className="w-full p-2 flex flex-col gap-3">
      {/* <TextField /> */}
      <h2 style={{ textAlign: "center" }}>Add User</h2>
      <form className="flex gap-2 flex-col" onSubmit={handleSubmit}>
        <TextField
          size="small"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        {formErrors.name && <Error>{formErrors.name}</Error>}
        <TextField
          size="small"
          label="Email"
          error={!!(formErrors.email)}
          helperText={formErrors.email}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          size="small"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
        />

        {/* <FreeSoloCreateOptionDialog /> */}
        <FormControl fullWidth required>
          <InputLabel id="manager-select-label">Branch</InputLabel>
          <Select
            size="small"
            name="branchId"
            label="Branch"
            aria-placeholder="Select Branch"
            value={formData.branchId}
            onChange={handleChange}
            fullWidth
            required>
            {orderData.map((item) => (
              <MenuItem value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="manager-select-label">Manager</InputLabel>
          <Select
            labelId="manager-select-label"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            label="Manager"
          >
            {managers.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <RadioGroup
          row
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          className="flex justify-center items-center">
          <FormControlLabel value={1} control={<Radio />} label="Admin" />
          <FormControlLabel
            value={2}
            control={<Radio />}
            label="Manager"
          />
          <FormControlLabel
            value={3}
            control={<Radio />}
            label="Employee"
          />
        </RadioGroup>
        <Button
          type="submit"
          // onSubmit={handleSubmit}
          variant="contained"
          color="primary"
          fullWidth>
          {loading && (
            <CircularProgress
              size={15}
              color="white"
              style={{ marginRight: 20 }}
            />
          )}{" "}
          Submit
        </Button>
      </form>
      <Button onClick={onClose} color="secondary" variant="outlined" fullWidth>
        Cancel
      </Button>
    </div>
  );
}

export default RegistrationForm;
