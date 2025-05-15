import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
} from "@mui/material";
import { api } from "../../api/apihandler";


const BranchModal = ({ open, handleClose, fetchBranch, isEdit = false, isFetching, branchData }) => {
    const [branch, setBranch] = useState({
        name: "",
        location: "",
        gstin: "",
        contact: "",
        address: "",
    });
    useEffect(() => {
        if (isFetching) return
        setBranch({
            name: branchData.name || "",
            location: branchData.location || "",
            gstin: branchData.gstin || "",
            contact: branchData.contact || "",
            address: branchData.address || "",
        })
        console.log(branchData)
    }, [isFetching, branchData])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBranch((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const resetForm = () => {
        setBranch({
            name: "",
            location: "",
            gstin: "",
            contact: "",
            address: "",
        })
    }
    const hasBranchChanged = () => {
        const originalBranch = {
            name: branchData.name || "",
            location: branchData.location || "",
            gstin: branchData.gstin || "",
            contact: branchData.contact || "",
            address: branchData.address || "",
        }
        return JSON.stringify(originalBranch) !== JSON.stringify(branch)
    }
    const handleSave = async (event) => {
        event.preventDefault();
        try {
            let response

            if (isEdit) {
                if (!hasBranchChanged()) {
                    alert("No changes detected. Nothing to save.");
                    return
                }
                response = branchData.id ? await api.put(`/branch/${branchData.id}`, branch) : "";
            } else {
                response = await api.post(`/branch`, branch);
            }
            console.log("Branch saved:", response?.data);
            handleClose(); fetchBranch(); resetForm()
        } catch (error) {
            console.error("Error saving branch:", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEdit ? "Edit" : "Add New"} Branch</DialogTitle>
            <DialogContent>

                <form onSubmit={handleSave} className="flex flex-col gap-2 p-2" >
                    <TextField
                        size="small"
                        label="Branch Name"
                        name="name"
                        value={branch.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        size="small"
                        label="Location"
                        name="location"
                        value={branch.location}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        size="small"
                        label="GST IN"
                        name="gstin"
                        value={branch.gstin}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        size="small"
                        label="Contact"
                        name="contact"
                        value={branch.contact}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        size="small"
                        label="Address"
                        name="address"
                        value={branch.address}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={2}
                        required
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary" variant="outlined">
                            Cancel
                        </Button>
                        <Button type={"submit"} color="primary" variant="contained">
                            {isEdit ? "Update" : "Save"}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>

        </Dialog>
    );
};

export default BranchModal;
