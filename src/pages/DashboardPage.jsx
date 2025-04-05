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
  Drawer,
  Button,
  Modal,
  Box,
} from "@mui/material";
import MenuDrawer from "../components/DashboardPage/MenuDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AddNewOrderModal from "../components/DashboardPage/AddNewOrderModal";

export default function DashboardPage() {
  const [selected, setSelected] = useState("Orders");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (selection) => setSelected(selection);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(!isModalOpen);

  const orders = [
    { orderId: "001", customerName: "Order A", pickup: "Delhi", dropoff: "Mumbai", items: 10, trucknum: "DL06IN2025", amount: 10000 },
    { orderId: "002", customerName: "Order B", pickup: "Delhi", dropoff: "Mumbai", items: 10, trucknum: "DL06IN2025", amount: 10000 },
    { orderId: "003", customerName: "Order C", pickup: "Delhi", dropoff: "Mumbai", items: 10, trucknum: "DL06IN2025", amount: 10000 },
  ];

  return (
    <div style={{ width: "95%", margin: "0 5px" }}>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Header with Add New Button */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <h1 className="text-2xl pb-3">{selected}</h1>
          <Button className="cursor-pointer" variant="contained" color="primary" onClick={handleOpenModal}>
            Add New
          </Button>
        </div>

        {selected === "Orders" && (
          <TableContainer component={Paper} elevation={3} style={{ width: "100%", marginTop: 8 }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer Name</strong></TableCell>
                  <TableCell><strong>Pickup</strong></TableCell>
                  <TableCell><strong>Dropoff</strong></TableCell>
                  <TableCell><strong>Items</strong></TableCell>
                  <TableCell><strong>Truck Number</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.pickup}</TableCell>
                    <TableCell>{order.dropoff}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.trucknum}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                      <Button color="error" variant="contained" size="small" startIcon={<CancelIcon />}>
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* Add New Order Modal */}
      <Drawer variant="persistent" anchor="right" open={isModalOpen}>
        <AddNewOrderModal onClose={handleCloseModal} />
      </Drawer>
    </div>
  );
}
