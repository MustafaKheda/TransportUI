import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Modal,
  Typography,
  Button,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  width: 400,
};

const UserAutocompleteFields = ({ usersname, setOrderData, orderData }) => {
  const [users, setUsers] = useState(usersname || []);
  const [openModal, setOpenModal] = useState(false);
  const [newUserName, setNewUserName] = useState({
    name: "",
    contact: "",
    address: "",
    gstin: "",
  });
  const [currentField, setCurrentField] = useState(""); // 'consigner' or 'consignee'

  const handleSelect = (field) => (event, value) => {
    const found = users.find((u) => u.name === value);
    if (!value) {
      setOrderData((prev) => ({ ...prev, [field]: "" }));
      return;
    }

    if (found) {
      setOrderData((prev) => ({ ...prev, [field]: found }));
    } else {
      setNewUserName({ name: value, contact: "", address: "", gstin: "" });
      setCurrentField(field);
      setOpenModal(true);
    }
  };

  const handleAddUser = () => {
    const updatedUsers = [...users, newUserName];
    setUsers(updatedUsers);
    setOrderData((prev) => ({ ...prev, [currentField]: newUserName }));
    setOpenModal(false);
    setNewUserName({ name: "", contact: "", address: "", gstin: "" });
    setCurrentField("");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2, // spacing between fields
          flexWrap: "wrap", // ensures responsiveness
          mt: 3,
          p: 2,
        }}
      >
        <Box sx={{ flex: 0.7 }}>
          <Autocomplete
            freeSolo
            size="small"
            options={users}
            value={orderData.consigner || ""}
            onChange={handleSelect("consigner")}
            renderInput={(params) => (
              <TextField {...params} label="Consigner" fullWidth />
            )}
          />
        </Box>

        <Box sx={{ flex: 0.7 }}>
          <Autocomplete
            freeSolo
            size="small"
            options={users}
            value={orderData.consignee || ""}
            onChange={handleSelect("consignee")}
            renderInput={(params) => (
              <TextField {...params} label="Consignee" fullWidth />
            )}
          />
        </Box>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Add New {currentField === "consigner" ? "Consigner" : "Consignee"}
          </Typography>
          <TextField
            label="Name"
            value={newUserName.name}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contact"
            value={newUserName.contact}
            onChange={(e) =>
              setNewUserName({ ...newUserName, contact: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            value={newUserName.address}
            onChange={(e) =>
              setNewUserName({ ...newUserName, address: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="GSTIN"
            value={newUserName.gstin}
            onChange={(e) =>
              setNewUserName({ ...newUserName, gstin: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleAddUser}>
            Add
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default UserAutocompleteFields;
