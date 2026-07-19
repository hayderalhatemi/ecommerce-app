import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Product, Order } from "../types";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

const AdminPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductForm>();

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

  const handleCreateProduct = async (data: ProductForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("category", data.category);
    formData.append("stock", String(data.stock));

    const res = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProducts((prev) => [...prev, res.data]);
    reset();
    toast.success("Product created!");
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
  <form onSubmit={handleSubmit(handleCreateProduct)} className="admin-product-form">
    <h3>Add New Product</h3>
    <div className="admin-form-grid">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register("name", { required: "Required" })} />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input id="category" type="text" {...register("category", { required: "Required" })} />
        {errors.category && <span className="error">{errors.category.message}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input id="price" type="number" step="0.01" {...register("price", { required: "Required" })} />
        {errors.price && <span className="error">{errors.price.message}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <input id="stock" type="number" {...register("stock", { required: "Required" })} />
        {errors.stock && <span className="error">{errors.stock.message}</span>}
      </div>
      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
        <label htmlFor="description">Description</label>
        <input id="description" type="text" {...register("description", { required: "Required" })} />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </div>
    </div>
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Creating..." : "Create Product"}
    </button>
  </form>
)}

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