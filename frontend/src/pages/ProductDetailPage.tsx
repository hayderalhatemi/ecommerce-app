import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import type { Product } from "../types";

const ProductDetailPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch {
                setError("Product not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
        }));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <p className="status-msg">Loading...</p>;
    if (error) return <p className="status-msg error">{error}</p>;
    if (!product) return null;

    return (
        <div className="product-detail">
            <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="product-detail-image"
            />
            <div className="product-detail-info">
                <h2>{product.name}</h2>
                <p className="product-category">{product.category}</p>
                <p className="product-detail-description">{product.description}</p>
                <p className="product-price">€{product.price.toFixed(2)}</p>
                <p className="product-stock">In stock: {product.stock}</p>
                <div className="quantity-selector">
                    <label htmlFor="quantity">Quantity</label>
                    <input id="quantity"
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>
                <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
                    {added ? "Added!" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductDetailPage;