import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import BranchesDetails from "../pages/BranchesDetails";
import UserDetails from "../pages/UserDetails";
import TruckDetails from "../pages/TruckDetails";
import Layout from "../Layout";

const RouteConfig = () => {
  return (
    <Routes>
      {/* Login page without Layout */}
      <Route path="/" element={<LoginPage />} />

      {/* All other routes wrapped inside Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/branchesdetails" element={<BranchesDetails />} />
        <Route path="/usersdetails" element={<UserDetails />} />
        <Route path="/trucksdetails" element={<TruckDetails />} />
      </Route>
    </Routes>
  );
};

export default RouteConfig;
