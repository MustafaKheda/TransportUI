import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";

const OrderModal = ({ open, handleClose, editData, handleChange, handleSave }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Order</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <TextField
            label="Order Name"
            name="name"
            value={editData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Units"
            name="units"
            type="number"
            value={editData.units}
            onChange={handleChange}
            fullWidth
            required
          />
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Per Unit"
              name="perUnit"
              type="number"
              value={editData.perUnit}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Unit Type</InputLabel>
              <Select
                name="unitType"
                value={editData.unitType}
                onChange={handleChange}
                label="Unit Type"
              >
                <MenuItem value="KG">KG</MenuItem>
                <MenuItem value="GRM">GRM</MenuItem>
                <MenuItem value="ML">ML</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Rate"
            name="rate"
            type="number"
            value={editData.rate}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
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

export default OrderModal;
