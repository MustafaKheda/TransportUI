import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { api } from '../../api/apihandler';
const UserModal = ({ open, handleClose, editData, handleChange, handleSave }) => {

  const [orderData,setOrderMetaData]=useState([])
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} p={1}>
          <TextField
            size="small"
            label="Username"
            name="username"
            value={editData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            size="small"
            label="Phone Number"
            name="phone"
            value={editData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
