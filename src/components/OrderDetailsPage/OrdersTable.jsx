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
import OrderModal from "./OrderModal";

const OrdersTable = () => {
  const [orders, setOrders] = useState([
    { id: "ORD123", name: "Apple Juice", units: 10, perUnit: 2, unitType: "KG", rate: 150 },
    { id: "ORD124", name: "Milk Packet", units: 20, perUnit: 1, unitType: "ML", rate: 80 },
  ]);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (order) => {
    setEditData(order);
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
    setOrders(orders.map((order) => (order.id === editData.id ? editData : order)));
    handleClose();
  };

  const handleDelete = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <>
      <TableContainer 
      component={Paper} 
      className="shadow-md">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>Order Name</strong></TableCell>
              <TableCell><strong>Units</strong></TableCell>
              <TableCell><strong>Per Unit</strong></TableCell>
              <TableCell><strong>Rate</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.units}</TableCell>
                <TableCell>{order.perUnit} {order.unitType}</TableCell>
                <TableCell>${order.rate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(order)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(order.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Modal */}
      {editData && (
        <OrderModal
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

export default OrdersTable;
