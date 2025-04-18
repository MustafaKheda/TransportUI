import React, { useEffect, useState } from "react";
import UsersTable from "../components/UsersDetailsPage/UsersTable";
import { Box, Button, Modal } from "@mui/material";
import RegistrationForm from "../components/UsersDetailsPage/RegistrationForm";
import { api } from "../api/apihandler";

function UserDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    const response = await api.get(`${import.meta.env.VITE_BASE_URL}/auth`);
    if (response.status == 200) {
      setUsers(response.data.users);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center p-6 gap-4 w-full">
      {/* Header Section */}
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
          Add User
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
          Add User
        </Button>
      </div>
      {/* <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl  font-semibold">Users Details</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition">
          Add User
        </button>
      </div> */}

      {/* Users Table */}
      <div className="w-full">
        <UsersTable users={users} setUsers={setUsers} />
      </div>

      {/* Modal for Registration Form */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}

        >
          <RegistrationForm managers={users.filter(item => [1, 2].includes(item.roleId))} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </div>
  );
}

export default UserDetails;
