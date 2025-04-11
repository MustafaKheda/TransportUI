import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Drawer,
  Button,
  CircularProgress,
} from "@mui/material";

import AddNewOrderModal from "../components/DashboardPage/AddNewOrderModal";
import { api } from "../api/apihandler";

function BranchesDetails() {
  const [selected, ] = useState("Branches");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordermetadata, setOrderMetaData] = useState([]);

  const handleCloseModal = () => setIsModalOpen(!isModalOpen);

 

  const getOrderformData = async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_BASE_URL}/branch`);
      console.log(response, "these are the branches");
      setOrderMetaData(response.data.branches);
    } catch (error) {
      console.log("error consoling:-", error);
    }
  };

  useEffect(() => {
    getOrderformData();
  }, []);
  return (
    <div className="p-6 min-w-full">
      <div style={{ width: "95%", margin: "0 5px" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          {/* Header with Add New Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}>
            <h1 className="text-2xl pb-3">{selected}</h1>
          
          </div>

          {selected === "Branches" && (
            <TableContainer
              component={Paper}
              elevation={3}
              style={{ width: "100%", marginTop: 8 }}>
              <Table style={{ width: "100%" }}>
                <TableHead style={{ width: "100%" }}>
                  <TableRow style={{ backgroundColor: "rgb(161, 239, 165)" }}>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      <strong>Branch ID</strong>
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      <strong>Branch Name</strong>
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      <strong>Location</strong>
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      <strong>GST IN</strong>
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      <strong>Contact</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Address</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                
                  {ordermetadata.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {order.id}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {order.name}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {order.location}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {order.gstin}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {order.contact}
                      </TableCell>
                      <TableCell>{order.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>

        {/* Add New Order Modal */}
        <Drawer variant="persistent" anchor="right" open={isModalOpen}>
          <AddNewOrderModal
            ordermetadata={ordermetadata}
            onClose={handleCloseModal}
          />
        </Drawer>
      </div>
    </div>
  );
}

export default BranchesDetails;
