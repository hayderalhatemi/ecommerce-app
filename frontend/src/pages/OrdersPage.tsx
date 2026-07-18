import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Order } from "../types";

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders/my-orders");
                setOrders(res.data);
            } catch {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <p className="status-msg">Loading orders...</p>;
    if (error) return <p className="status-msg error">{error}</p>;
    if (orders.length === 0) return <p className="status-msg">No orders yet.</p>
}