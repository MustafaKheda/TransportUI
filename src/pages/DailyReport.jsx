import React, { useState, useEffect, useCallback } from "react";
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
import { printPdf } from "../utils/Pdf";
export default function OrdersFilterTable() {
  const [ordersData, setOrdersData] = useState([]);
  const [filters, setFilters] = useState({
    pickup: "",
    dropoff: "",
    search: "",
    from: new Date().toISOString().split("T")[0],
    to: "",
    trucks: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchOrders = useCallback(async (query, isPrint = false) => {
    try {
      if (isPrint) {
        const res = await api.get(`/orders/daily-report?${query}`, { responseType: 'blob' });
        console.log(res)
        const pdfBlob = res.data;
        const pdfUrl = URL.createObjectURL(pdfBlob);
        printPdf(pdfUrl)
      } else {
        setLoading(true);
        setError(null);
        const res = await api.get(`/orders/daily-report?${query}`);
        console.log(res)
        const data = res.data?.orders;
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
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [])
  console.log(ordersData, "ordersData")
  useEffect(() => {
    console.log("useEffect")
    const query = new URLSearchParams({
      from: filters.from,
      to: filters.to,
      pickup: filters.pickup,
      dropoff: filters.dropoff,
      trucks: filters.trucks,
    }).toString();

    fetchOrders(query);

  }, [
    filters.from,
    filters.to,
    filters.pickup,
    filters.dropoff,
    filters.trucks,
  ]);


  const handlePrint = (e) => {
    e.preventDefault()
    const query = new URLSearchParams({
      from: filters.from,
      to: filters.to,
      pickup: filters.pickup,
      dropoff: filters.dropoff,
      trucks: filters.trucks,
      print: true,
    }).toString();
    fetchOrders(query, true)
  }
  // const filteredOrders = [...ordersData];

  return (
    <div className="p-6 min-w-full">
      <h2 className="text-2xl font-bold mb-4">Orders Table</h2>

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
        <button className="ml-auto" onClick={handlePrint}>print</button>
      </div>

      {loading ? (
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ width: "100%" }}>
          <Table style={{ width: "100%" }}>
            <TableHead>
              <TableRow style={{ backgroundColor: "rgb(161, 239, 165)" }}>
                {[
                  "Date",
                  "Order No.",
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
        <p className="text-red-500 min-w">Error: {error}</p>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ width: "100%", marginTop: 8 }}>
          <Table style={{ width: "100%" }}>
            <TableHead>
              <TableRow style={{ backgroundColor: "rgb(161, 239, 165)" }}>
                {[
                  "Date",
                  "Order No.",
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
                      {order.createdAt
                        ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(order.createdAt))
                        : "-"}
                    </TableCell>
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
              {loading && (
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
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
