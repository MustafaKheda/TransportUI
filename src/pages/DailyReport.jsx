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
  const [reportType, setReportType] = useState("custom");
  const [selectedMonth, setSelectedMonth] = useState("");
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
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState(null);
  const fetchOrders = useCallback(async (query, isPrint = false) => {
    try {
      if (isPrint) {
        const res = await api.get(`/orders/daily-report?${query}`, { responseType: 'blob' });
        console.log(res)
        // const pdfBlob = res.data;
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        printPdf(pdfUrl)
      } else {
        setLoading(true);
        setError(null);
        const res = await api.get(`/orders/daily-report?${query}`);
        console.log(res)
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
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [])
  console.log(ordersData, "ordersData")
  useEffect(() => {
    let queryParams = {};

    if (reportType === "daily") {
      // For 1-day report: from and to are the same
      queryParams = {
        from: filters.from,
        to: filters.from,
      };
    } else if (reportType === "monthly" && selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const from = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const to = `${year}-${month}-${lastDay}`;
      queryParams = {
        from,
        to,
        pickup: filters.pickup,
        dropoff: filters.dropoff,
        trucks: filters.trucks,
      };
    } else {
      // Custom report - all filters
      queryParams = {
        from: filters.from,
        to: filters.to,
        pickup: filters.pickup,
        dropoff: filters.dropoff,
        trucks: filters.trucks,
      };
    }

    const query = new URLSearchParams(queryParams).toString();
    fetchOrders(query);
  }, [
    filters.from,
    filters.to,
    filters.pickup,
    filters.dropoff,
    filters.trucks,
    reportType,
    selectedMonth,
  ]);


  const handlePrint = async (e) => {
    e.preventDefault();

    let queryParams = {};

    if (reportType === "daily") {
      queryParams = {
        from: filters.from,
        to: filters.from,
        print: true,
      };
    } else if (reportType === "monthly" && selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const from = `${year}-${month}-01`;
      const to = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
      queryParams = {
        from,
        to,
        pickup: filters.pickup,
        dropoff: filters.dropoff,
        trucks: filters.trucks,
        print: true,
      };
    } else {
      queryParams = {
        from: filters.from,
        to: filters.to,
        pickup: filters.pickup,
        dropoff: filters.dropoff,
        trucks: filters.trucks,
        print: true,
      };
    }

    const query = new URLSearchParams(queryParams).toString();
    setIsPrinting(true)
    await fetchOrders(query, true);
    setIsPrinting(false)
  };
  // const filteredOrders = [...ordersData];

  return (
    <div className="p-6 min-w-full">
      <h2 className="text-2xl font-bold mb-4">Orders Table</h2>


      <div className="p-6 w-full">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          {/* Report Type Selector */}
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="custom">Custom Report</option>
            </select>
          </div>

          {/* Date Pickers (conditional) */}
          {reportType === "daily" && (
            <div className="flex flex-col w-full md:w-1/4">
              <label className="text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          )}

          {reportType === "monthly" && (
            <div className="flex flex-col w-full md:w-1/4">
              <label className="text-sm font-medium text-gray-700 mb-1">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          )}

          {/* Print Button */}
          <div className="md:ml-auto">
            <button
              disabled={isPrinting}
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all w-full md:w-auto"
            >
              {isPrinting ? `🖨️ Printing...` : "🖨️ Print Report"}
            </button>
          </div>
        </div>

        {/* Custom Filters */}
        {reportType === "custom" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <input
              type="text"
              placeholder="Pickup Location"
              value={filters.pickup}
              onChange={(e) => setFilters({ ...filters, pickup: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <input
              type="text"
              placeholder="Dropoff Location"
              value={filters.dropoff}
              onChange={(e) => setFilters({ ...filters, dropoff: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <input
              type="text"
              placeholder="Truck No. (e.g., 3)"
              value={filters.trucks}
              onChange={(e) => setFilters({ ...filters, trucks: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        )}
      </div>

      {
        loading ? (
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
                          ? new Intl.DateTimeFormat({
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
        )
      }
    </div >
  );
}
