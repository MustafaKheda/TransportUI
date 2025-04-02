import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const MenuDrawer = ({ onSelect, toggleDrawer }) => {
  return (
    <Drawer variant="persistent" anchor="left" open>
      <IconButton onClick={toggleDrawer} style={{ alignSelf: "flex-end", margin: 10 }}>
        <MenuIcon />
      </IconButton>
      <List>
        {["Orders", "Branches", "Users", "Truck"].map((text) => (
          <ListItem button key={text} onClick={() => onSelect(text)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MenuDrawer;