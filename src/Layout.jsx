
// Layout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuDrawer from "./components/DashboardPage/MenuDrawer";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Layout = () => {
  const [selected, setSelected] = useState("Orders");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleSelect = (selection) => setSelected(selection);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  return (
    <div className="flex">
      <Drawer variant="persistent" anchor="left" open={drawerOpen}>
        <MenuDrawer
          onSelect={handleSelect}
          toggleDrawer={toggleDrawer} />
      </Drawer>

      {/* Page Content */}
      {!drawerOpen && (
        <IconButton onClick={toggleDrawer} style={{ alignSelf: "flex-start", marginBottom: 10 }}>
          <MenuIcon />
        </IconButton>
      )}

      <div style={{ marginLeft: drawerOpen ? 280 : 0, padding: 10, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }} className="flex-grow p-4 ">
        <Outlet /> {/* This renders the current page component */}
      </div>
    </div>
  );
};

export default Layout;
