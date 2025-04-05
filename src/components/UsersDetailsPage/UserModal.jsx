import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
} from "@mui/material";

const UserModal = ({ open, handleClose, editData, handleChange, handleSave }) => {
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
