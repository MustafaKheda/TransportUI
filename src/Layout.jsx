
// Layout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuDrawer from "./components/DashboardPage/MenuDrawer";
import { Avatar, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useOrderMeta } from "./utils/OrderDataContext";
const drawerWidth = 270
const Layout = () => {
  const { orderMetaData } = useOrderMeta()
  const [selected, setSelected] = useState("Orders");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const handleSelect = (selection) => setSelected(selection);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  return (
    <Box display="flex" flexDirection="row" minHeight="100vh" bgcolor="#f9fafb">
      {/* Sidebar Drawer */}
      <Drawer
        variant={"persistent"}
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <MenuDrawer onSelect={() => { }} toggleDrawer={toggleDrawer} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: !drawerOpen ? `${-drawerWidth}px` : 0,
          transition: 'margin 0.3s ease',
        }}
      >
        <AppBar
          position="sticky"
          elevation={1}
          sx={{
            bgcolor: "#ffffff",
            color: "#111827",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
            <Box display="flex" alignItems="center" gap={1}>
              {!drawerOpen && (
                <IconButton onClick={toggleDrawer} edge="start">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" fontWeight="bold">
                {orderMetaData?.branch?.name}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="subtitle1">{orderMetaData.user.name}</Typography>

              <Avatar alt={orderMetaData.user.name} />

            </Box>
          </Toolbar>
        </AppBar>

        <Box component="section" p={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
