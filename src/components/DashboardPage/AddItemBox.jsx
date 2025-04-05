import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const AddItem = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    weight: "",
    perUnit: "",
    rate: "",
  });

  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = () => {
    if (
      formData.itemName &&
      formData.weight &&
      formData.perUnit &&
      formData.rate
    ) {
      setItems([...items, formData]);
      setFormData({
        itemName: "",
        weight: "",
        perUnit: "",
        rate: "",
      });
    }
  };

  return (
    <>
      {/* Input Form */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          padding: 2,
          backgroundColor: "#fafafa",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          label="Item Name"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Per Unit"
          name="perUnit"
          value={formData.perUnit}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Rate"
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          fullWidth
        />

        <Box
          sx={{
            gridColumn: "span 2",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={handleAddItem} color="secondary" variant="outlined">
            Add Item
          </Button>
        </Box>
      </Box>

      {/* Display Items */}
      <Box sx={{mt:3, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              padding: 2,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 2,
              backgroundColor: "#fff",
            }}
          >
            <Typography><strong>Name:</strong> {item.itemName}</Typography>
            <Typography><strong>Weight:</strong> {item.weight}</Typography>
            <Typography><strong>Per Unit:</strong> {item.perUnit}</Typography>
            <Typography><strong>Rate:</strong> {item.rate}</Typography>
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default AddItem;
