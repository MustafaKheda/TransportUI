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
import RegistrationForm from "../components/DashboardPage/RegistrationForm";

export default function DashboardPage() {
  const [selected, setSelected] = useState("Orders");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSelect = (selection) => {
    setSelected(selection);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const orders = [
    {
      orderId: "001",
      customerName: "Order A",
      pickup: "Delhi",
      dropoff: "Mumbai",
      items: 10,
      trucknum: "DL06IN2025",
      amount:10000
    },
    {
      orderId: "002",
      customerName: "Order B",
      pickup: "Delhi",
      dropoff: "Mumbai",
      items: 10,
      trucknum: "DL06IN2025",
      amount:10000
    },
    {
      orderId: "003",
      customerName: "Order C",
      pickup: "Delhi",
      dropoff: "Mumbai",
      items: 10,
      trucknum: "DL06IN2025",
      amount:10000
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Drawer 
      variant="persistent" 
      anchor="left" 
      open={drawerOpen}>
        <MenuDrawer onSelect={handleSelect} toggleDrawer={toggleDrawer} />
      </Drawer>

      <div
        style={{
          marginLeft: drawerOpen ? 240 : 0,
          padding: 10,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!drawerOpen && (
          <IconButton
            onClick={toggleDrawer}
            style={{ alignSelf: "flex-start", marginBottom: 10 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <h1 className="text-2xl pb-3">{selected}</h1>

        {selected === "Orders" && (
          <TableContainer
            component={Paper}
            elevation={3}
            style={{ 
              width: "80%" ,
            }}
          >
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>Order ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Customer Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Pickup</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Dropoff</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Items</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Truck Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
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
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(order)}
                      >
                        <EditIcon />
                      </IconButton>
                      <Button
                        color="error"
                        variant="contained"
                        size="small"
                        startIcon={<CancelIcon />}
                      >
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

      {/* Registration Form Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <RegistrationForm order={selectedOrder} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </div>
  );
}
