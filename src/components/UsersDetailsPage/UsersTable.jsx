import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { api } from "../../api/apihandler";
const UsersTable = ({ users, handleEdit, fetchUsers }) => {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleOpenDeleteModel = (id) => {
    setDeleteId(id)
    setOpen(true)
  };
  const handleDelete = async (id) => {
    console.log(id)
    try {
      const res = await api.delete(`/auth/${id}`)
      setOpen(false)
      console.log(res)
      fetchUsers()
      setDeleteId(null)
    } catch (error) {
      console.error(error, "error while Deleting order")
    }

  }
  const handleClose = () => {
    setOpen(false);
    setDeleteId(null)
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>no</Button>
          <Button onClick={() => handleDelete(deleteId)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead style={{ backgroundColor: "rgb(161, 239, 165)" }}>
            <TableRow>
              <TableCell style={{ borderRight: "1px solid #ccc" }}>
                <strong>User ID</strong>
              </TableCell>
              <TableCell style={{ borderRight: "1px solid #ccc" }}>
                <strong>Username</strong>
              </TableCell>
              <TableCell style={{ borderRight: "1px solid #ccc" }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell style={{ borderRight: "1px solid #ccc" }}>
                <strong>Role</strong>
              </TableCell>
              <TableCell style={{ borderRight: "1px solid #ccc" }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  {user.id}
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  {user.name}
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  {user.email}
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  {user.roleId == 1 ? "Admin" : user.roleId == 2 ? "Maneger" : "Employee"}
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <IconButton onClick={() => handleEdit(user.id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteModel(user.id)}
                    color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersTable;
