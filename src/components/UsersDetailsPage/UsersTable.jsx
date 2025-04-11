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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserModal from "./UserModal";
import { api } from "../../api/apihandler";
const UsersTable = ({ users, setUsers }) => {

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
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    color="secondary">
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
