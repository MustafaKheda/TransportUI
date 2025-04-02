import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Drawer } from "@mui/material";
import MenuDrawer from "../components/DashboardPage/MenuDrawer";


export default function DashboardPage() {
  const [selected, setSelected] = useState("Orders");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleSelect = (selection) => {
    setSelected(selection);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const orders = [
    { orderId: "001", orderName: "Order A" },
    { orderId: "002", orderName: "Order B" },
    { orderId: "003", orderName: "Order C" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Drawer variant="persistent" anchor="left" open={drawerOpen}>
        <MenuDrawer onSelect={handleSelect} toggleDrawer={toggleDrawer} />
      </Drawer>
      <div style={{ marginLeft: drawerOpen ? 240 : 0, padding: 20, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <IconButton onClick={toggleDrawer} style={{ alignSelf: "flex-start", marginBottom: 10 }}>
          <MenuIcon />
        </IconButton>
        <h1>{selected}</h1>
        {selected === "Orders" && (
          <TableContainer component={Paper} elevation={3} style={{ width: "60%" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Order Name</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.orderName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
