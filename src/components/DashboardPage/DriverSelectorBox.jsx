// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Autocomplete,
//   Box,
//   Modal,
//   Typography,
//   Button,
// } from "@mui/material";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   borderRadius: 2,
//   p: 4,
//   width: 400,
// };

// const DriverAutocomplete = ({ driverInfo }) => {
//   const [drivers, setDrivers] = useState(driverInfo || []);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [newDriverName, setNewDriverName] = useState("");
//   const [newPhoneNumber, setNewPhoneNumber] = useState("");
//   console.log(driverInfo)
//   // // Prefill selectedDriver if driverInfo is provided
//   // useEffect(() => {
//   //   if (driverInfo?.length > 0) {
//   //     const firstDriver = driverInfo[0];
//   //     setSelectedDriver(firstDriver);
//   //     setInputValue(firstDriver.name);
//   //   }
//   // }, [driverInfo]);

//   const handleSelect = (event, newValue) => {
//     if (typeof newValue === "string") {
//       const existing = drivers.find((d) => d.name === newValue);
//       if (existing) {
//         setSelectedDriver(existing);
//       } else {
//         setNewDriverName(newValue);
//         setOpenModal(true);
//       }
//     } else if (newValue) {
//       setSelectedDriver(newValue);
//     } else {
//       setSelectedDriver(null);
//     }
//   };

//   const handleAddDriver = () => {
//     const newDriver = { name: newDriverName, phoneNumber: newPhoneNumber };
//     setDrivers((prev) => [...prev, newDriver]);
//     setSelectedDriver(newDriver);
//     setInputValue(newDriver.name);
//     setOpenModal(false);
//     setNewDriverName("");
//     setNewPhoneNumber("");
//   };

//   return (
//     <>
//       <Box sx={{ display: "flex", width: "100%", gap: 3 }}>
//         <Box sx={{ flex: 1 }}>
//           <Autocomplete
//             freeSolo
//             options={driverInfo}
//             getOptionLabel={(option) =>
//               typeof option === "string" ? option : option.name || ""
//             }
//             value={selectedDriver}
//             inputValue={inputValue}
//             onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
//             onChange={handleSelect}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Driver Name"
//                 variant="outlined"
//                 fullWidth
//               />
//             )}
//           />
//         </Box>

//         <Box sx={{ flex: 1 }}>
//           <TextField
//             label="Phone Number"
//             variant="outlined"
//             fullWidth
//             value={selectedDriver?.phoneNumber || ""}
//             onChange={(e) => {
//               setSelectedDriver((prev) => ({
//                 ...prev,
//                 phoneNumber: e.target.value
//               }))
//             }}
//           />
//         </Box>
//       </Box>

//       {/* Modal to Add New Driver */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" mb={2}>
//             Add New Driver
//           </Typography>
//           <TextField
//             label="Driver Name"
//             value={newDriverName}
//             fullWidth
//             disabled
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Phone Number"
//             value={newPhoneNumber}
//             onChange={(e) => setNewPhoneNumber(e.target.value)}
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleAddDriver}
//             disabled={!newPhoneNumber}
//           >
//             Add Driver
//           </Button>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default DriverAutocomplete;
import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";

const DriverAutocomplete = ({ driverInfo = [], orderData, setOrderData, phoneError, nameError, phoneHelperText, nameHelperText, setFormErrors, formErrors }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);

  // const [inputValue, setInputValue] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");


  // const handleSelect = (event, newValue) => {
  //   let name = "";
  //   let phone = "";
  //   if (typeof newValue === "string") {
  //     name = newValue;
  //   } else if (newValue?.name) {
  //     name = newValue.name;
  //     phone = newValue.phoneNumber || "";
  //   }
  //   setSelectedDriver({ name, phoneNumber: phone });
  //   setPhoneNumber(phone);
  //   setInputValue(name);

  //   setOrderData((prev) => ({
  //     ...prev,
  //     driverName: name,
  //     driverPhone: phone,
  //   }));
  // };
  // useEffect(() => {
  //   if (selectedDriver) {
  //     setOrderData((prev) => ({
  //       ...prev,
  //       driverName: selectedDriver.name || "",
  //       driverPhone: selectedDriver.phoneNumber || "",
  //     }));
  //   }
  // }, [selectedDriver]);
  return (
    <Box sx={{ display: "flex", width: "100%", gap: 3 }}>
      <Box sx={{ flex: 1 }}>
        {/* <Autocomplete
          freeSolo
          options={driverInfo}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name || ""
          }
          value={selectedDriver}
          inputValue={inputValue}
          onInputChange={(e, newInputValue) => {
            setOrderData((prev) => ({
              ...prev,
              driverName: newInputValue,
            }));

            setInputValue(newInputValue)
          }}
          onChange={handleSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Driver Name"
              variant="outlined"
              fullWidth
            />
          )}
        /> */}
        <TextField
          label="Driver Name"
          variant="outlined"
          fullWidth
          size="small"
          name="driverName"
          error={nameError}
          helperText={nameHelperText}
          value={orderData.driverName}
          onChange={(e) => {
            // const newPhone = e.target.value;
            // setPhoneNumber(newPhone);

            // setSelectedDriver((prev) => ({
            //   ...prev,
            //   name: inputValue,
            //   phoneNumber: newPhone,
            // }));
            setFormErrors({ ...formErrors, driverName: null });
            setOrderData((prev) => ({
              ...prev,
              driverName: e.target.value,
            }));
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="driverPhone"
          size="small"
          error={phoneError}
          helperText={phoneHelperText}
          value={orderData.driverPhone}
          onChange={(e) => {
            // const newPhone = e.target.value;
            // setPhoneNumber(newPhone);

            // setSelectedDriver((prev) => ({
            //   ...prev,
            //   name: inputValue,
            //   phoneNumber: newPhone,
            // }));
            setFormErrors({ ...formErrors, driverPhone: null });

            setOrderData((prev) => ({
              ...prev,
              driverPhone: e.target.value,
            }));
          }}
        />
      </Box>
    </Box>
  );
};

export default DriverAutocomplete;
