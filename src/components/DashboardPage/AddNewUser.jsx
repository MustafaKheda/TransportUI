// import React, { useState } from "react";
// import {
//   TextField,
//   Autocomplete,
//   Box,
//   Modal,
//   Typography,
//   Button,
// } from "@mui/material";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   borderRadius: 2,
//   p: 4,
//   width: 400,
// };

// const UserAutocompleteFields = ({ usersname, setOrderData, orderData }) => {
//   const [users, setUsers] = useState(usersname || []);
//   const [openModal, setOpenModal] = useState(false);
//   const [newUserName, setNewUserName] = useState({
//     name: "",
//     contact: "",
//     address: "",
//     gstin: "",
//   });
//   const [currentField, setCurrentField] = useState(""); // 'consigner' or 'consignee'

//   const handleSelect = (field) => (event, value) => {
//     const found = users.find((u) => u.name === value);
//     if (!value) {
//       setOrderData((prev) => ({ ...prev, [field]: "" }));
//       return;
//     }

//     if (found) {
//       setOrderData((prev) => ({ ...prev, [field]: found }));
//     } else {
//       setNewUserName({ name: value, contact: "", address: "", gstin: "" });
//       setCurrentField(field);
//       setOpenModal(true);
//     }
//   };

//   const handleAddUser = () => {
//     const updatedUsers = [...users, newUserName];
//     setUsers(updatedUsers);
//     setOrderData((prev) => ({ ...prev, [currentField]: newUserName }));
//     setOpenModal(false);
//     setNewUserName({ name: "", contact: "", address: "", gstin: "" });
//     setCurrentField("");
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           gap: 2, // spacing between fields
//           flexWrap: "wrap", // ensures responsiveness
//           mt: 3,
//           p: 2,
//         }}
//       >
//         <Box sx={{ flex: 0.7 }}>
//           <Autocomplete
//             freeSolo
//             size="small"
//             options={users}
//             value={orderData.consigner || ""}
//             onChange={handleSelect("consigner")}
//             renderInput={(params) => (
//               <TextField {...params} label="Consigner" fullWidth />
//             )}
//           />
//         </Box>

//         <Box sx={{ flex: 0.7 }}>
//           <Autocomplete
//             freeSolo
//             size="small"
//             options={users}
//             value={orderData.consignee || ""}
//             onChange={handleSelect("consignee")}
//             renderInput={(params) => (
//               <TextField {...params} label="Consignee" fullWidth />
//             )}
//           />
//         </Box>
//       </Box>

//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" mb={2}>
//             Add New {currentField === "consigner" ? "Consigner" : "Consignee"}
//           </Typography>
//           <TextField
//             label="Name"
//             value={newUserName.name}
//             fullWidth
//             disabled
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Contact"
//             value={newUserName.contact}
//             onChange={(e) =>
//               setNewUserName({ ...newUserName, contact: e.target.value })
//             }
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Address"
//             value={newUserName.address}
//             onChange={(e) =>
//               setNewUserName({ ...newUserName, address: e.target.value })
//             }
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="GSTIN"
//             value={newUserName.gstin}
//             onChange={(e) =>
//               setNewUserName({ ...newUserName, gstin: e.target.value })
//             }
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <Button variant="contained" fullWidth onClick={handleAddUser}>
//             Add
//           </Button>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default UserAutocompleteFields;
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { api } from '../../api/apihandler';
import { Box } from '@mui/material';

const filter = createFilterOptions();

export default function UserAutocompleteFields({ users, value, setValue, name }) {
  const [open, toggleOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue({
      name: '',
      gstin: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    name: '',
    gstin: '',
    address: '',
    contact: '',
  });
  const [loading, setLoading] = React.useState(true);


  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true)
      const newCustomer = await api.post("/customers", { ...dialogValue })
      setValue(newCustomer?.data?.customer, name, true);
      handleClose()
    } catch (error) {
      console.error(error)
    }

    // handleClose();
  };
  return (
    <>
      <Autocomplete
        fullWidth
        value={users.find((u) => u.id === value) || null}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
                year: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue((prev) => ({
              ...prev,
              name: newValue.inputValue,
            }));
          } else {
            setValue(newValue, name);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        isOptionEqualToValue={(option, value) => option.id === value}
        id="free-solo-dialog-demo"
        options={users}
        getOptionLabel={(option) => {
          // for example value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (typeof option === "number") {
            return users.f;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {option.name}
            </li>
          );
        }}
        freeSolo
        renderInput={(params) => {
          return <TextField {...params} size="small" label={name} fullWidth />;
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            Add New {name === "consigner" ? "Consigner" : "Consignee"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={dialogValue.name}
              fullWidth
              disabled
              onSubmit={(e) =>
                setDialogValue((prev) => ({ ...prev, name: e.target.value }))
              }
              onChange={(e) =>
                setDialogValue((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contact"
              value={dialogValue.contact}
              onSubmit={(e) =>
                setDialogValue((prev) => ({ ...prev, name: e.target.value }))
              }
              onChange={(e) =>
                setDialogValue((prev) => ({ ...prev, contact: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              value={dialogValue.address}
              onChange={(e) =>
                setDialogValue((prev) => ({ ...prev, address: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="GSTIN"
              value={dialogValue.gstin}
              onChange={(e) =>
                setDialogValue((prev) => ({ ...prev, gstin: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">Add</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top