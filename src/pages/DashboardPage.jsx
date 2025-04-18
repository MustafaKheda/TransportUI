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
} from "@mui/material";
import MenuDrawer from "../components/DashboardPage/MenuDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AddNewOrderModal from "../components/DashboardPage/AddNewOrderModal";
import { api } from "../api/apihandler";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { TablePagination, CircularProgress, Box } from "@mui/material";
import { printPdf } from "../utils/Pdf";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordermetadata, setOrderMetaData] = useState({})

  const [metaData, setMetaData] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pdfLoadingIds, setPdfLoadingIds] = useState(new Set());
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getOrders(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
    getOrders(0, newLimit);
  };
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = (isCreated = false) => {
    setIsModalOpen(!isModalOpen)
    if (isCreated) {
      getOrderformData();
      getOrders();
    }
  };
  const getOrderformData = async () => {
    try {

      const response = await api.get(`/orders/meta`)
      setOrderMetaData(response.data)
    } catch (error) {
      console.log("error consoling:-", error)
    }
  }
  const getOrders = async (currentPage = 0, limit = 10) => {
    setLoading(true);
    try {
      const response = await api.get(`/orders?page=${currentPage + 1}&limit=${limit}`);
      setMetaData(response.data.meta)
      setOrders(response.data.orders);
    } catch (error) {
      console.log("error consoling:-", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      getOrderformData();
      getOrders();
    };
    fetchData();
  }, [])
  const handleDownload = async (id) => {
    setPdfLoadingIds(prev => new Set(prev).add(id));
    try {
      const response = await api.get(`/orders/pdf/${id}`, { responseType: 'blob' });
      const pdfBlob = response.data;
      const pdfUrl = URL.createObjectURL(pdfBlob);
      console.log(pdfUrl)
      printPdf(pdfUrl);
    } catch (error) {
      console.error("Failed to download PDF", error);
    } finally {
      setPdfLoadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
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
          <h1 className="text-2xl pb-3"> Orders </h1>
          <Button
            className="cursor-pointer"
            variant="contained"
            color="primary"
            onClick={handleOpenModal}>
            Add New
          </Button>
        </div>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ width: "100%", mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "rgb(161, 239, 165)" }}>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <strong>Order #</strong>
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <strong>Consignor</strong>
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <strong>Consignee</strong>
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <strong>Pickup</strong>
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <strong>Dropoff</strong>
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #ccc" }}
                  align="center">
                  <strong>Items</strong>
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <strong>Truck #</strong>
                </TableCell>
                <TableCell style={{ borderRight: "1px solid #ccc" }}>
                  <strong>Driver</strong>
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #ccc" }}
                  align="right">
                  <strong>Amount (₹)</strong>
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid #ccc" }}
                  align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <TableRow key="loading">
                <TableCell
                  style={{ borderRight: "1px solid #ccc" }}
                  colSpan={10}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={4}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.consignor?.name || "N/A"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.consignee?.name || "N/A"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.pickupLocation}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.dropoffLocation}
                    </TableCell>
                    <TableCell
                      style={{ borderRight: "1px solid #ccc" }}
                      align="center">
                      {order._count?.orderItems || 0}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.truck?.truckNumber || "N/A"}
                    </TableCell>
                    <TableCell style={{ borderRight: "1px solid #ccc" }}>
                      {order.driver?.name || "N/A"}
                    </TableCell>
                    <TableCell
                      style={{ borderRight: "1px solid #ccc" }}
                      align="right">
                      ₹{order.invoice?.totalAmount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell
                      style={{ borderRight: "1px solid #ccc" }}
                      align="center">
                      {pdfLoadingIds.has(order.id) ? (
                        <CircularProgress size={24} />
                      ) : (
                        <>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error">
                            <CancelIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDownload(order.id)}
                            color="info">
                            <CloudDownloadIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={metaData?.total || 0} // TODO: get actual total from backend
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Add New Order Modal */}
      <Drawer
        variant="persistent"
        anchor="right"
        PaperProps={{
          sx: {
            width: "80%",
            // bgcolor: "red", // or use backgroundColor: 'red'
          },
        }}
        open={isModalOpen}>
        <AddNewOrderModal

          ordermetadata={ordermetadata}
          onClose={handleCloseModal}
        />
      </Drawer>
    </div>
  );
}
