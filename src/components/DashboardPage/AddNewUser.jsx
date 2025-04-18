import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { api } from '../../api/apihandler';

const filter = createFilterOptions();

export default function UserAutocompleteFields({ users, value, setValue, name, inputRef, ...rest }) {
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
          return <TextField inputRef={inputRef} // ✅ Pass ref here
            {...params} size='small' label={name} fullWidth {...rest} />
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