import React, { useState, useEffect } from "react";
import { Button, TextField, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from "@mui/material";

function RegistrationForm({ order, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    manager: "",
    role: "employee",
  });

  useEffect(() => {
    if (order) {
      setFormData((prevData) => ({
        ...prevData,
        name: order.customerName, // Prefill customer name
      }));
    }
  }, [order]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    onClose();
  };

  return (
    <div className="w-full p-2 flex flex-col gap-3">
      <h2 style={{ textAlign: "center" }}>Edit Order</h2>
      <form className="flex gap-2 flex-col" onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
        <Select name="branch" value={formData.branch} onChange={handleChange} fullWidth required>
          <MenuItem value="">Select Branch</MenuItem>
          <MenuItem value="Branch 1">Branch 1</MenuItem>
          <MenuItem value="Branch 2">Branch 2</MenuItem>
        </Select>
        <Select name="manager" value={formData.manager} onChange={handleChange} fullWidth required>
          <MenuItem value="">Select Manager</MenuItem>
          <MenuItem value="Manager 1">Manager 1</MenuItem>
          <MenuItem value="Manager 2">Manager 2</MenuItem>
        </Select>
        <RadioGroup 
        row 
        name="role" 
        value={formData.role} 
        onChange={handleChange}
        className="flex justify-center items-center"
        >
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          <FormControlLabel value="manager" control={<Radio />} label="Manager" />
          <FormControlLabel value="employee" control={<Radio />} label="Employee" />
        </RadioGroup>
        <Button type="submit" variant="contained" color="primary" fullWidth>
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
