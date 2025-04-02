import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [manager, setManager] = useState("");
  const [role, setRole] = useState("employee");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { name, email, password, branch, manager, role };
    console.log("Form Data Submitted:", formData);
    navigate("/")
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4"> 
            <label className="block text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Branch</label>
            <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full px-4 py-2 border rounded-md">
              <option value="">Select Branch</option>
              <option value="Branch 1">Branch 1</option>
              <option value="Branch 2">Branch 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Manager</label>
            <select value={manager} onChange={(e) => setManager(e.target.value)} className="w-full px-4 py-2 border rounded-md">
              <option value="">Select Manager</option>
              <option value="Manager 1">Manager 1</option>
              <option value="Manager 2">Manager 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <div className="flex gap-4">
              <label>
                <input type="radio" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} />
                Admin
              </label>
              <label>
                <input type="radio" value="manager" checked={role === "manager"} onChange={() => setRole("manager")} />
                Manager
              </label>
              <label>
                <input type="radio" value="employee" checked={role === "employee"} onChange={() => setRole("employee")} />
                Employee
              </label>
            </div>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
