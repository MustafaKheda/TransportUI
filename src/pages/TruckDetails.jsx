import { Button } from '@mui/material';
import React from 'react'

function TruckDetails() {
  return (
    <div className="p-6 min-w-full">
    <div
           style={{
             display: "flex",
             justifyContent: "space-between",
             width: "100%",
             alignItems: "center",
             padding: "1rem",
             borderRadius: "12px",
             background: "linear-gradient(135deg, #66a6ff, #89f7fe)",
             boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
             transform: "perspective(1000px) rotateX(1deg)",
             marginBottom: 20,
           }}>
           <h1
             style={{
               fontSize: "1.5rem",
               fontWeight: "bold",
               color: "#fff",
               textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
             }}>
             Truck
           </h1>
           <Button
             variant="contained"
             onClick={()=>{}}
             style={{
               background: "linear-gradient(to right, #66a6ff, #ff7eb3)",
               color: "#fff",
               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
               borderRadius: "8px",
               textTransform: "none",
             }}>
             Add New Truck
           </Button>
         </div>
    </div>
  );
}

export default TruckDetails