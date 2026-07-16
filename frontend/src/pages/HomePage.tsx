import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import type { Product } from "../types";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="status-msg">Loading products...</p>;
  if (error) return <p className="status-msg error">{error}</p>;
  if (products.length === 0) return <p className="status-msg">No products found.</p>;

  return (
    <div>
      <h2 className="page-title">Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <Link to={`/products/${product._id}`} key={product._id} className="product-card">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">€{product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;