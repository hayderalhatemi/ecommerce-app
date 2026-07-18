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
    if (orders.length === 0) return <p className="status-msg">No orders yet.</p>;

    return (
        <div>
            <h2 className="page-title">My Orders</h2>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">Order #{order._id.slice(-6)}</span>
                        <span className={`order-status status-${order.status}`}>{order.status}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item) => (
                            <div key={item.product} className="order-item-row">
                              <span>{item.name}</span>
                              <span>x{item.quantity}</span>
                              <span>€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <span>Total: €{order.totalPrice.toFixed(2)}</span>
                        <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                      </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;