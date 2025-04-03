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
} from "@mui/material";

const OrderModal = ({ open, handleClose, editData, handleChange, handleSave }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Order</DialogTitle>
      <DialogContent className="flex flex-col gap-3 p-4">
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
        <div className="flex gap-2">
          <TextField
            label="Per Unit"
            name="perUnit"
            type="number"
            value={editData.perUnit}
            onChange={handleChange}
            fullWidth
            required
          />
          <Select
            name="unitType"
            value={editData.unitType}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="KG">KG</MenuItem>
            <MenuItem value="GRM">GRM</MenuItem>
            <MenuItem value="ML">ML</MenuItem>
          </Select>
        </div>
        <TextField
          label="Rate"
          name="rate"
          type="number"
          value={editData.rate}
          onChange={handleChange}
          fullWidth
          required
        />
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

export default OrderModal;
