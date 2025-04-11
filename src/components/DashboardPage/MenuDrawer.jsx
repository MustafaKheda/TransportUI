import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const menuItems = [
  { text: "Orders", icon: <ShoppingCartIcon />, path: "/dashboard" },
  { text: "Daily Report", icon: <LocalShippingIcon />, path: "/daily-report" },
  { text: "Branches", icon: <BusinessIcon />, path: "/branchesdetails" },
  { text: "Users", icon: <PeopleIcon />, path: "/usersdetails" },
  { text: "Truck", icon: <LocalShippingIcon />, path: "/trucksdetails" },
];

const MenuDrawer = ({ toggleDrawer }) => {
  const navigate = useNavigate(); // Initialize navigation
const [selected, setisSelected] = useState("/dashboard");
  const handleNavigation = (path) => {
    navigate(path);
    setisSelected(path)
    // if (toggleDrawer) toggleDrawer(); // Close drawer if it's not permanent
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      // color="rgb(149, 212, 254)"
      elevation={3}
      open
      sx={{
        width: 270,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 270,
          backgroundColor: "rgb(149, 212, 254)",
        },
      }}>
      {/* Top Section */}
      <div
        // style={{ backgroundColor: "rgba(149, 212, 254, 0.34)" }}
        className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <AdminPanelSettingsIcon fontSize="large" color="primary" />
          <span className="text-lg font-semibold">Admin</span>
        </div>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Menu List */}
      <List className="w-full">
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            button
            key={text}
            onClick={() => handleNavigation(path)}
            className="cursor-pointer"
            style={{
              backgroundColor:
                selected == path ? "rgb(161, 239, 165)" : "rgba(0,0,0,0)",
            }}>
            <ListItemIcon
              color={selected == path ? "rgb(0, 0, 0)" : "rgba(0,0,0,0)"}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;
