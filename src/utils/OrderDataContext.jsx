import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/apihandler"; // adjust as needed
import { CircularProgress } from "@mui/material";

const OrderMetaContext = createContext();
const CACHE_KEY = "orderMetaData";
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 60 minutes

export const OrderMetaProvider = ({ children }) => {
    const [orderMetaData, setOrderMetaData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAndCache = async () => {
        try {
            const response = await api.get("/orders/meta");
            const cacheObject = {
                data: response.data,
                timestamp: Date.now(),
            };
            localStorage.setItem("role", response.data.roleId)
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
            setOrderMetaData(response.data);
        } catch (error) {
            console.error("Failed to fetch order meta data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getOrderformData = async () => {
        try {
            setLoading(true);
            const cached = localStorage.getItem(CACHE_KEY);
            await fetchAndCache();
        } catch (error) {
            console.error("Error loading cached order meta:", error);
            setLoading(false);
        }
    };

    const refreshOrderMeta = async () => {
        await fetchAndCache();
    };

    useEffect(() => {
        getOrderformData();
    }, []);
    if (loading) {
        return <div className="flex h-[100vh] justify-center items-center">
            <CircularProgress color="info" />
        </div>
    }
    return (
        <OrderMetaContext.Provider value={{ orderMetaData, loading, refreshOrderMeta }}>
            {children}
        </OrderMetaContext.Provider>
    );
};

export const useOrderMeta = () => useContext(OrderMetaContext);
