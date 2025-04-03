import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserModal from "./UserModal";

const UsersTable = () => {
  const [users, setUsers] = useState([
    { id: "USR001", username: "JohnDoe", phone: "9876543210" },
    { id: "USR002", username: "JaneSmith", phone: "8765432109" },
  ]);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (user) => {
    setEditData(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUsers(users.map((user) => (user.id === editData.id ? editData : user)));
    handleClose();
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <>
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Phone Number</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Edit Modal */}
      {editData && (
        <UserModal
          open={open}
          handleClose={handleClose}
          editData={editData}
          handleChange={handleChange}
          handleSave={handleSave}
        />
      )}
    </>
  );
};

export default UsersTable;
