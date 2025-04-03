import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import OrderDetails from "../pages/OrderDetails";
import BranchesDetails from "../pages/BranchesDetails";
import UserDetails from "../pages/UserDetails";
import TruckDetails from "../pages/TruckDetails";
const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage/>} /> 
      <Route path="/orderdetails" element={<OrderDetails/>}/>
      <Route path="/branchesdetails" element={<BranchesDetails/>}/>
      <Route path="/usersdetails" element={<UserDetails/>}/>
      <Route path="/trucksdetails" element={<TruckDetails/>}/>
      
    </Routes>
  );
};

export default RouteConfig;
