
// Layout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuDrawer from "./components/DashboardPage/MenuDrawer";

const Layout = () => {
  const [open, setOpen] = useState(true); // Control drawer state

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <div className="flex">
      {/* Sidebar Drawer */}
      <MenuDrawer open={open} toggleDrawer={toggleDrawer} />
      {/* Page Content */}
      <div className="flex-grow p-4">
        <Outlet /> {/* This renders the current page component */}
      </div>
    </div>
  );
};

export default Layout;
