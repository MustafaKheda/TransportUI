import React, { useState, useEffect } from "react";
import { api } from "../api/apihandler";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
export default function OrdersFilterTable() {
  const [ordersData, setOrdersData] = useState([]);
  const [filters, setFilters] = useState({
    pickup: "",
    dropoff: "",
    search: "",
    from: "",
    to: "",
    trucks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          from: filters.from,
          to: filters.to,
          pickup: filters.pickup,
          dropoff: filters.dropoff,
          trucks: filters.trucks,
        }).toString();

        const res = await api.get(`/orders/daily-report?${query}`);

        const data = res.data;
        console.log(data);
        // 🔍 Extract unique values
        const truckNumbers = [
          ...new Set(
            data.map((order) => order.truck?.truckNumber).filter(Boolean)
          ),
        ];
        const pickupLocations = [
          ...new Set(data.map((order) => order.pickupLocation).filter(Boolean)),
        ];
        const dropoffLocations = [
          ...new Set(
            data.map((order) => order.dropoffLocation).filter(Boolean)
          ),
        ];

        // Use these for filters
        console.log(
          { truckNumbers, pickupLocations, dropoffLocations },
          "filters"
        );
        setOrdersData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    filters.from,
    filters.to,
    filters.pickup,
    filters.dropoff,
    filters.trucks,
  ]);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          from: filters.from,
          to: filters.to,
          pickup: filters.pickup,
          dropoff: filters.dropoff,
          trucks: filters.trucks,
        }).toString();

        const res = await api(`orders/daily-report?${query}`);
        const data = res.data;
        console.log(data);
        // 🔍 Extract unique values
        const truckNumbers = [
          ...new Set(
            data.map((order) => order.truck?.truckNumber).filter(Boolean)
          ),
        ];
        const pickupLocations = [
          ...new Set(data.map((order) => order.pickupLocation).filter(Boolean)),
        ];
        const dropoffLocations = [
          ...new Set(
            data.map((order) => order.dropoffLocation).filter(Boolean)
          ),
        ];

        // Use these for filters
        console.log(
          { truckNumbers, pickupLocations, dropoffLocations },
          "filters"
        );
        setOrdersData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    filters.from,
    filters.to,
    filters.pickup,
    filters.dropoff,
    filters.trucks,
  ]);

  const filteredOrders = [...ordersData];

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
             Builty Reports
           </h1>
           {/* <Button
             variant="contained"
             onClick={handleOpenModal}
             style={{
               background: "linear-gradient(to right, #66a6ff, #ff7eb3)",
               color: "#fff",
               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
               borderRadius: "8px",
               textTransform: "none",
             }}>
             Add User
           </Button> */}
         </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          placeholder="Pickup Location"
          value={filters.pickup}
          onChange={(e) => setFilters({ ...filters, pickup: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          placeholder="Dropoff Location"
          value={filters.dropoff}
          onChange={(e) => setFilters({ ...filters, dropoff: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          placeholder="Truck No. (e.g., 3)"
          value={filters.trucks}
          onChange={(e) => setFilters({ ...filters, trucks: e.target.value })}
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border rounded p-2 w-full"
        />
      </div>

      {loading ? (
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ width: "100%" }}>
          <Table style={{ width: "100%" }}>
            <TableHead>
              <TableRow style={{ backgroundColor: "rgb(161, 239, 165)"}}>
                {[
                  "Bilty No.",
                  "Pickup",
                  "Dropoff",
                  "Consignee",
                  "Items",
                  "Trucker No.",
                  "Driver",
                  "Remaining Amount",
                ].map((label, index) => (
                  <TableCell
                    key={index}
                    style={{
                      borderRight: index < 7 ? "1px solid #ccc" : "none",
                      width: `${100 / 8}%`,
                      textAlign: "center",
                    }}>
                    <strong>{label}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ width: "100%", marginTop: 8 }}>
          <Table style={{ width: "100%" }}>
            <TableHead>
              <TableRow style={{ backgroundColor: "rgb(161, 239, 165)"}}>
                {[
                  "Bilty No.",
                  "Pickup",
                  "Dropoff",
                  "Consignee",
                  "Items",
                  "Trucker No.",
                  "Driver",
                  "Remaining Amount",
                ].map((label, index) => (
                  <TableCell
                    key={index}
                    style={{
                      borderRight: index < 7 ? "1px solid #ccc" : "none",
                      width: `${100 / 8}%`,
                      textAlign: "center",
                    }}>
                    <strong>{label}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersData.length > 0 ? (
                ordersData.map((order, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.orderNumber || "-"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.pickupLocation || "-"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.dropoffLocation || "-"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.consignee?.name || "-"}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ borderRight: "1px solid #ccc" }}>
                      {order._count?.orderItems || "-"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.truck?.truckNumber || "-"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.driver?.name || "-"}
                    </TableCell>
                    <TableCell>
                      ₹
                      {Number(
                        (order.invoice?.totalAmount || 0) -
                          (order.invoice?.advance || 0)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" style={{ padding: 16 }}>
                    No matching records found.
                  </TableCell>
                </TableRow>
              )}
         { loading && (
          <TableRow key="loading">
            <TableCell style={{ borderRight: "1px solid #ccc" }} colSpan={10}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={4}>
                <CircularProgress />
              </Box>
            </TableCell>
          </TableRow>
          ) }
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
