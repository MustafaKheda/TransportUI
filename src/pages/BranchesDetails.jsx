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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { api } from "../api/apihandler";
import BranchModal from "../components/BranchesDetailsPage/BranchModel";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getRole } from "../components/DashboardPage/MenuDrawer";
const allowedRoles = [1]
function BranchesDetails() {

  const [selected] = useState("Branches");

  const [isEdit, setIsEdit] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [fetchedBranch, setFetchedBranch] = useState({})
  const handleClickOpen = (id) => {
    setDeleteId(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null)
    setIsEdit(false)
  };
  const handleEdit = async (id) => {
    console.log(id)
    setIsEdit(true)
    setFetching(true)
    setIsModalOpen(true)
    try {
      const res = await api.get(`/branch/${id}`)
      setFetchedBranch(res.data.branch)
      setFetching(false)
    } catch (error) {
      console.error(error, "error while fetching order")
      setFetching(false)
    }

  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchs, setbranchs] = useState([]);

  const handleModalTrigger = () => {
    setIsModalOpen(!isModalOpen); setIsEdit(false)
  };

  const getBranchData = async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_BASE_URL}/branch`);
      console.log(response, "these are the branches");
      setbranchs(response.data.branches);
    } catch (error) {
      console.log("error consoling:-", error);
    }
  };
  const handleDelete = async (id) => {
    console.log(id)
    try {
      const res = await api.delete(`/branch/${id}`)
      setOpen(false)
      console.log(res)
      getBranchData()
      setDeleteId(null)
    } catch (error) {
      console.error(error, "error while Deleting order")
    }
  }

  useEffect(() => {
    getBranchData();
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
              Branches
            </h1>
            <Button
              variant="contained"
              onClick={handleModalTrigger}
              style={{
                background: "linear-gradient(to right, #66a6ff, #ff7eb3)",
                color: "#fff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
                textTransform: "none",
              }}>
              Add Branch
            </Button>
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
                    {allowedRoles.includes(getRole()) && <TableCell>
                      <strong>Action</strong>
                    </TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {branchs.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {item.id}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {item.name}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {item.location}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {item.gstin}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>
                        {item.contact}
                      </TableCell>
                      <TableCell style={{ borderRight: "1px solid #ccc" }}>{item.address}</TableCell>
                      {allowedRoles.includes(getRole()) && <TableCell className="!flex"><IconButton color="primary" onClick={() => handleEdit(item.id)}>
                        <EditIcon />
                      </IconButton>
                        <IconButton color="error" onClick={() => handleClickOpen(item.id)}>
                          <CancelIcon />
                        </IconButton>
                      </TableCell>}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
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
              Are You Sure You Want to Delete This Branch?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>no</Button>
            <Button onClick={() => handleDelete(deleteId)} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <BranchModal open={isModalOpen} isEdit={isEdit} isFetching={fetching} branchData={fetchedBranch} handleClose={handleModalTrigger} fetchBranch={getBranchData} />
      </div>
    </div>
  );
}

export default BranchesDetails;
