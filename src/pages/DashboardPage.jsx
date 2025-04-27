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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AddNewOrderModal from "../components/DashboardPage/AddNewOrderModal";
import { api } from "../api/apihandler";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { TablePagination, CircularProgress, Box } from "@mui/material";
import { printPdf } from "../utils/Pdf";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [metaData, setMetaData] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [fetchedOrder, setFetchedOrder] = useState({})
  const [pdfLoadingIds, setPdfLoadingIds] = useState(new Set());
  const handleClickOpen = (id) => {
    setDeleteId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null)
  };
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
    setFetching(false)
    setIsEdit(false)
    setFetchedOrder({})
    console.log(isCreated)
    if (isCreated) {
      getOrders();
    }
  };

  const getOrders = async (currentPage = 0, limit = 10) => {
    console.log("orders called")
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

  const handleEdit = async (id) => {
    console.log(id)
    setIsEdit(true)
    setFetching(true)
    setIsModalOpen(true)
    try {
      const res = await api.get(`/orders/${id}`)
      setFetchedOrder(res.data.order)
      setFetching(false)
    } catch (error) {
      console.error(error, "error while fetching order")
      setFetching(false)
    }

  }
  const handleDelete = async (id) => {
    console.log(id)
    try {
      const res = await api.delete(`/orders/${id}`)
      setOpen(false)
      console.log(res)
      fetchData()
      setDeleteId(null)
    } catch (error) {
      console.error(error, "error while Deleting order")
    }

  }
  const fetchData = async () => {
    getOrders();
  };

  useEffect(() => {
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
    <div style={{ width: "100%", margin: "0 5px" }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Order"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are You Sure You Want to Delete This Order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>no</Button>
          <Button onClick={() => handleDelete(deleteId)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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
          Orders
        </h1>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          style={{
            background: "linear-gradient(to right, #66a6ff, #ff7eb3)",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            textTransform: "none",
          }}>
          Create
        </Button>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        {/* Header with Add New Button */}

        <TableContainer
          component={Paper}
          elevation={3}

          sx={{
            width: "100%",
            mt: 2,
            minHeight: '75vh',
            maxHeight: '75vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px', // thinner scrollbar
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888', // thumb color
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
          }}>
          <Table stickyHeader size="small">
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
              <TableRow aria-rowspan={10} key="loading">
                <TableCell
                  style={{ borderRight: "1px solid #ccc" }}
                  colSpan={10} rowSpan={10}>
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
              <TableBody className="!overflow-y-auto !max-h-[50vh]">
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
                      <br />
                      <span>({order?.driver?.phoneNumber || "N/A"})</span>

                    </TableCell>
                    <TableCell
                      style={{ borderRight: "1px solid #ccc" }}
                      align="right">
                      ₹{order.invoice?.totalAmount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell
                      style={{ borderRight: "1px solid #ccc", p: "1px" }}
                      align="center">
                      {pdfLoadingIds.has(order.id) ? (
                        <CircularProgress size={24} />
                      ) : (
                        <>
                          <IconButton color="primary" onClick={() => handleEdit(order.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleClickOpen(order.id)}>
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
          isEdit={isEdit}
          isFetching={fetching}
          order={fetchedOrder}
          onClose={handleCloseModal}
        />
      </Drawer>
    </div>
  );
}
