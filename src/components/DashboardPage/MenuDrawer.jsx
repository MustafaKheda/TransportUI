import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from '@mui/icons-material/Logout';
import { api } from "../../api/apihandler";
import logo from "../../assets/DTC.png";
const menuItems = [
  { text: "Daily Report", icon: <LocalShippingIcon />, path: "/daily-report" },
  { text: "Orders", icon: <ShoppingCartIcon />, path: "/dashboard" },
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
  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200) {
        navigate("/")
      }
    } catch (error) {

    }

  }
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open
      sx={{
        width: 270,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 270,
          // background: "linear-gradient(135deg, #87F2FE, #66A6FD)",
          boxShadow: "6px 0 20px rgba(0,0,0,0.2)",
          borderRight: "none",
          transform: "perspective(1200px) rotateY(1deg)",
        },
      }}>
      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b border-blue-200">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            style={{
              height: 40,
              objectFit: "contain",
              filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.3))",
            }}
          />
        </div>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon sx={{ color: "#1f1f1f" }} />
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
            sx={{
              backgroundColor:
                selected === path ? "rgba(255, 255, 255, 0.4)" : "transparent",
              transition: "0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}>
            <ListItemIcon
              sx={{
                color: selected === path ? " #66a6ff" : "#333",
                minWidth: 36,
              }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: selected === path ? "bold" : "normal",
                color: selected === path ? " #66a6ff" : "#222",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>

    // <Drawer
    //   variant="permanent"
    //   anchor="left"
    //   // color="rgb(149, 212, 254)"
    //   elevation={3}
    //   open
    //   sx={{
    //     width: 270,
    //     flexShrink: 0,
    //     "& .MuiDrawer-paper": {
    //       width: 270,
    //       backgroundColor: "rgb(149, 212, 254)",
    //     },
    //   }}>
    //   {/* Top Section */}
    //   <div
    //     // style={{ backgroundColor: "rgba(149, 212, 254, 0.34)" }}
    //     className="flex items-center justify-between p-4 border-b">
    //     <div className="flex items-center gap-3">
    //       {/* <AdminPanelSettingsIcon fontSize="large" color="primary" /> */}
    //       <img
    //         src={logo}
    //         alt="Logo"
    //         style={{ height: 40, objectFit: "contain" }}
    //       />
    //       {/* <span className="text-lg font-semibold">Admin</span> */}
    //     </div>
    //     <IconButton onClick={toggleDrawer}>
    //       <MenuIcon />
    //     </IconButton>
    //   </div>

    //   {/* Menu List */}
    //   <List className="w-full">
    //     {menuItems.map(({ text, icon, path }) => (
    //       <ListItem
    //         button
    //         key={text}
    //         onClick={() => handleNavigation(path)}
    //         className="cursor-pointer"
    //         style={{
    //           backgroundColor:
    //             selected == path ? "rgb(161, 239, 165)" : "rgba(0,0,0,0)",
    //         }}>
    //         <ListItemIcon
    //           color={selected == path ? "rgb(0, 0, 0)" : "rgba(0,0,0,0)"}>
    //           {icon}
    //         </ListItemIcon>
    //         <ListItemText primary={text} />
    //       </ListItem>
    //     ))}
    //   </List>
    // </Drawer>
  );
};

export default MenuDrawer;
