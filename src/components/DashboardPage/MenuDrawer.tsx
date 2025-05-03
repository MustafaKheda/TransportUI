import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from '@mui/icons-material/Logout';
import { api } from "../../api/apihandler";
import logo from "../../assets/DTC.png";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useOrderMeta } from "../../utils/OrderDataContext";
const menuItems = [
  { text: "Daily Report", icon: <LocalShippingIcon />, path: "/daily-report", allowedRoles: [1, 2, 3] },
  { text: "Orders", icon: <ShoppingCartIcon />, path: "/dashboard", allowedRoles: [1, 2, 3] },
  { text: "Branches", icon: <BusinessIcon />, path: "/branchesdetails", allowedRoles: [1, 2] },
  { text: "Users", icon: <PeopleIcon />, path: "/usersdetails", allowedRoles: [1] },
  { text: "Truck", icon: <LocalShippingIcon />, path: "/trucksdetails", allowedRoles: [1, 2] },
];

export const getRole = () => {
  const role = Number(localStorage.getItem("role"))
  if (role) {
    return role
  }
}
const MenuDrawer = ({ toggleDrawer }) => {
  const { orderMetaData } = useOrderMeta()
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
      localStorage.removeItem("role")
      if (response.status === 200) {
        navigate("/")
      }
    } catch (error) {

    }

  }

  return (
    <>

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
        <div className="flex items-center justify-between p-4 border-blue-200">
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
        <List className="w-full flex flex-col flex-1 ">
          {menuItems.map(({ text, icon, path, allowedRoles }) => {
            return allowedRoles.includes(getRole()) && <ListItem
              button
              key={text}
              onClick={() => handleNavigation(path)}
              className="cursor-pointer"
              sx={{
                backgroundColor:
                  window.location.pathname === path ? "rgba(255, 255, 255, 0.4)" : "transparent",
                transition: "0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}>
              <ListItemIcon
                sx={{
                  color: window.location.pathname === path ? " #66a6ff" : "#333",
                  minWidth: 36,
                }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: window.location.pathname === path ? "bold" : "normal",
                  color: window.location.pathname === path ? " #66a6ff" : "#222",
                }}
              />
            </ListItem>
          })}

          <ListItem

            button
            key={"logout-button"}
            onClick={handleLogout}
            className="cursor-pointer"
            sx={{
              mt: "auto",
              backgroundColor:
                "rgba(255, 255, 255, 0.4)",
              transition: "0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}>
            <ListItemIcon
              sx={{
                color: "#333",
                minWidth: 36,
              }}>
              {<LogoutIcon />}
            </ListItemIcon>
            <ListItemText
              primary={"logout"}
              primaryTypographyProps={{
                fontWeight: "600",
                color: "#222",
              }}
            />
          </ListItem>

        </List>
      </Drawer >
    </>
  );
};

export default MenuDrawer;
