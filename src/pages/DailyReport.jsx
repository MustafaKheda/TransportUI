import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from "react";
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
import TruckMultiSelect from "../components/TruckAutocomplete";
import { useOrderMeta } from "../utils/OrderDataContext";
export default function OrdersFilterTable() {
  const [reportType, setReportType] = useState("daily");
  const { orderMetaData, loading: metaLoading } = useOrderMeta()

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });
  console.log(orderMetaData)
  const [ordersData, setOrdersData] = useState([]);
  const [filters, setFilters] = useState({
    pickup: orderMetaData?.roleId !== 1 ? (orderMetaData?.userLoction || "") : "",
    dropoff: "",
    search: "",
    from: new Date().toISOString().split("T")[0],
    to: "",
    trucks: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
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
          { pickupLocations, dropoffLocations },
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

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      pickup: orderMetaData?.roleId !== 1 ? (orderMetaData?.userLoction || "") : "",
    }))

  }, [orderMetaData?.userLoction])

  useEffect(() => {
    if (metaLoading) return
    let queryParams = {};

    if (reportType === "daily") {
      // For 1-day report: from and to are the same
      queryParams = {
        from: filters.from,
        to: filters.from,
        pickup: filters.pickup,
      };
    } else if (reportType === "monthly" && selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const from = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const to = `${year}-${month}-${lastDay}`;
      queryParams = {
        from,
        pickup: filters.pickup,
        to,
      };
    } else {
      // Custom report - all filters
      queryParams = {
        from: filters.from,
        to: filters.to,
        pickup: filters.pickup,
        dropoff: filters.dropoff,
        trucks: filters.trucks.map((item) => item.id),
        search: filters.search,
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
    filters.pickup,
    reportType,
    selectedMonth,
    metaLoading
  ]);


  const handlePrint = async (e) => {
    e.preventDefault();

    let queryParams = {};

    if (reportType === "daily") {
      queryParams = {
        from: filters.from,
        to: filters.from,
        print: true,
        pickup: filters.pickup,
      };
    } else if (reportType === "monthly" && selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const from = `${year}-${month}-01`;
      const to = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
      queryParams = {
        from,
        to,
        pickup: filters.pickup,
        print: true,
      };
    } else {
      queryParams = {
        from: filters.from,
        to: filters.to,
        pickup: filters.pickup,
        dropoff: filters.dropoff,
        trucks: filters.trucks.map(item => item.id),
        search: filters.search, // include this!
        print: true,
      };
    }

    const query = new URLSearchParams(queryParams).toString();
    setIsPrinting(true)
    await fetchOrders(query, true);
    setIsPrinting(false)
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchQuery }));
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery])

  // const filteredOrders = [...ordersData];
  return (
    <div className=" min-w-full">
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
          marginBottom: 5,
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
      </div>


      <div className="p-2 w-full mb-4">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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

            <TruckMultiSelect options={orderMetaData.trucks} selectedTrucks={filters.trucks} setSelectedTrucks={(newValue) => setFilters((prev) => ({ ...prev, trucks: newValue }))} />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        )}
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
        <p className="text-red-500">Error: {error}</p>
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
                        ? `${new Date(order.createdAt).getDate()}-${new Date(order.createdAt).getMonth() + 1}-${new Date(order.createdAt).getFullYear()}`
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
                      <br />
                      <span>({order?.driver?.phoneNumber || "-"})</span>
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
