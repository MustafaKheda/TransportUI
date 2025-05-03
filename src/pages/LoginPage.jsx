import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../api/authStore";
import { api } from "../api/apihandler";
import logo from "../assets/DTC.png";
import { useOrderMeta } from "../utils/OrderDataContext";
function LoginPage() {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetErr, setResetErr] = useState("");
  const { email, password, setEmail, setPassword, resetCredentials } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/auth/login`, {
        email,
        password
      });
      localStorage.removeItem("role")

      resetCredentials();
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen">
      {/* Left Side - Background Image */}
      <div
        className="w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('../assets/loginbg.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-8">
          <img
            src={logo}
            alt="Logo"
            style={{ height: 40, objectFit: "contain", marginBottom: 20 }}
          />
          <h1 className="text-4xl font-bold">Your Trusted Partner in Logistics</h1>
          <p className="mt-4 text-lg text-gray-200 text-center">
            We ensure fast and reliable delivery services to meet your needs.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleOnChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
              <p
                className="text-sm text-blue-500 cursor-pointer hover:underline text-right"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </p>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                } text-white py-2 rounded-md text-lg font-medium transition duration-300`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000a6]  z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>

            <input
              type="email"
              className="w-full px-4 py-2 border rounded mb-3"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full px-4 py-2 border rounded mb-3"
              placeholder="Enter your password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              required
            />
            {resetMsg && <p className="text-green-600 text-sm mb-2">{resetMsg}</p>}
            {resetErr && <p className="text-red-600 text-sm mb-2">{resetErr}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm text-gray-600"
                onClick={() => {
                  setShowForgotModal(false);
                  setResetEmail("");
                  setResetMsg("");
                  setResetErr("");
                }}
              >
                Cancel
              </button>
              <button
                disabled={!resetEmail || !resetPassword}
                className="px-4 py-2 bg-blue-500  text-white rounded hover:bg-blue-600 text-sm"
                onClick={async () => {
                  try {
                    setResetMsg("");
                    setResetErr("");
                    const res = await api.patch("/auth/forgot-password", { email: resetEmail, newPassword: resetPassword });
                    setResetMsg(res.data.message || "Reset link sent to your email.");
                  } catch (err) {
                    setResetErr(err?.response?.data?.message || "Failed to send reset link.");
                  }
                }}
              >
                Send Reset Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
