import React, { useState, useEffect } from "react";
import { api } from "../api/apihandler";

export default function OrdersFilterTable() {
    const [ordersData, setOrdersData] = useState([]);
    const [filters, setFilters] = useState({
        pickup: "",
        dropoff: "",
        search: "",
        from: "",
        to: "",
        trucks: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const query = new URLSearchParams({
                    from: filters.from,
                    to: filters.to,
                    pickup: filters.pickup,
                    dropoff: filters.dropoff,
                    trucks: filters.trucks,
                }).toString();

                const res = await api.get(
                    `/orders/daily-report?${query}`,);

                const data = res.data;
                console.log(data)
                // 🔍 Extract unique values
                const truckNumbers = [...new Set(data.map(order => order.truck?.truckNumber).filter(Boolean))];
                const pickupLocations = [...new Set(data.map(order => order.pickupLocation).filter(Boolean))];
                const dropoffLocations = [...new Set(data.map(order => order.dropoffLocation).filter(Boolean))];

                // Use these for filters
                console.log({ truckNumbers, pickupLocations, dropoffLocations }, "filters");
                setOrdersData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [filters.from, filters.to, filters.pickup, filters.dropoff, filters.trucks]);
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const query = new URLSearchParams({
                    from: filters.from,
                    to: filters.to,
                    pickup: filters.pickup,
                    dropoff: filters.dropoff,
                    trucks: filters.trucks,
                }).toString();

                const res = await api(
                    `orders/daily-report?${query}`,
                );
                const data = res.data
                console.log(data)
                // 🔍 Extract unique values
                const truckNumbers = [...new Set(data.map(order => order.truck?.truckNumber).filter(Boolean))];
                const pickupLocations = [...new Set(data.map(order => order.pickupLocation).filter(Boolean))];
                const dropoffLocations = [...new Set(data.map(order => order.dropoffLocation).filter(Boolean))];

                // Use these for filters
                console.log({ truckNumbers, pickupLocations, dropoffLocations }, "filters");
                setOrdersData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [filters.from, filters.to, filters.pickup, filters.dropoff, filters.trucks]);

    const filteredOrders = [...ordersData]

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Orders Table</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                    className="border rounded p-2 w-full"
                />
                <input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                    className="border rounded p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Pickup Location"
                    value={filters.pickup}
                    onChange={(e) => setFilters({ ...filters, pickup: e.target.value })}
                    className="border rounded p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Dropoff Location"
                    value={filters.dropoff}
                    onChange={(e) => setFilters({ ...filters, dropoff: e.target.value })}
                    className="border rounded p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Truck No. (e.g., 3)"
                    value={filters.trucks}
                    onChange={(e) => setFilters({ ...filters, trucks: e.target.value })}
                    className="border rounded p-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="border rounded p-2 w-full"
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <table className="min-w-full bg-white border rounded shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Bilty No.</th>
                            <th className="p-2 border">Pickup</th>
                            <th className="p-2 border">Dropoff</th>
                            <th className="p-2 border">Consignee</th>
                            <th className="p-2 border">Items</th>
                            <th className="p-2 border">Trucker No.</th>
                            <th className="p-2 border">Driver</th>
                            <th className="p-2 border">Remaing Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.length > 0 ? (
                            ordersData.map((order, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="p-2 border">{order.orderNumber || "-"}</td>
                                    <td className="p-2 border">{order.pickupLocation || "-"}</td>
                                    <td className="p-2 border">{order.dropoffLocation || "-"}</td>
                                    <td className="p-2 border">{order.consignee?.name || "-"}</td>
                                    <td className="p-2 border">{order._count?.orderItems || "-"}</td>
                                    <td className="p-2 border">{order.truck?.truckNumber || "-"}</td>
                                    <td className="p-2 border">{order.driver?.name || "-"}</td>
                                    <td className="p-2 border">₹{order.invoice.totalAmount - order.invoice.advance || 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center p-4">
                                    No matching records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
