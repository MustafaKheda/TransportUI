import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react'
import { api } from "../api/apihandler";
function TruckDetails() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrucks = async () => {
    try {
      const res = await api.get("/trucks");
      console.log(res)
      setTrucks(res.data);
    } catch (err) {
      setError("Failed to fetch truck details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);
  return (
    <div className="p-6 min-w-full">
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
          Truck
        </h1>
      </div>
      {/* <Button
          variant="contained"
          onClick={() => { }}
          style={{
            background: "linear-gradient(to right, #66a6ff, #ff7eb3)",
            color: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            textTransform: "none",
          }}>
          Add New Truck
        </Button> */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : trucks.length === 0 ? (
        <p className="text-center text-gray-600">No trucks found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 font-semibold">
              <tr>
                <th className="px-4 py-3">Truck Number</th>
                <th className="px-4 py-3">Capacity (kg)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total Orders</th>
                <th className="px-4 py-3">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map((truck) => (
                <tr
                  key={truck.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{truck.truckNumber}</td>
                  <td className="px-4 py-3">{truck.capacity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${truck.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {truck.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{truck._count?.orders || 0}</td>
                  <td className="px-4 py-3">
                    {new Date(truck.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
}

export default TruckDetails