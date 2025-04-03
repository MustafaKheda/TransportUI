import React from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const menuItems = [
  { text: "Orders", icon: <ShoppingCartIcon /> },
  { text: "Branches", icon: <BusinessIcon /> },
  { text: "Users", icon: <PeopleIcon /> },
  { text: "Truck", icon: <LocalShippingIcon /> },
];

const MenuDrawer = ({ onSelect, toggleDrawer }) => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      elevation={3}
      open
      sx={{ width: 270, flexShrink: 0, "& .MuiDrawer-paper": { width: 270 } }}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b">
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
        {menuItems.map(({ text, icon }) => (
          <ListItem
            button
            key={text}
            onClick={() => onSelect(text)}
            className="border-b"
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;
