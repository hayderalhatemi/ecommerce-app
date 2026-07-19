import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Product, Order } from "../types";
import toast from "react-hot-toast";

const AdminPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders"),
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
    toast.success("Product deleted.");
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: status as Order["status"] } : o))
    );
    toast.success("Order status updated.");
  };

  if (loading) return <p className="status-msg">Loading...</p>;

  return (
    <div>
      <h2 className="page-title">Admin Dashboard</h2>
      <div className="admin-tabs">
        <button type="button" className={activeTab === "products" ? "tab active" : "tab"} onClick={() => setActiveTab("products")}>
          Products ({products.length})
        </button>
        <button type="button" className={activeTab === "orders" ? "tab active" : "tab"} onClick={() => setActiveTab("orders")}>
          Orders ({orders.length})
        </button>
      </div>

      {activeTab === "products" && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>€{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button type="button" className="remove-btn" onClick={() => handleDeleteProduct(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>€{order.totalPrice.toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;