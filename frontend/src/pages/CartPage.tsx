import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) return <p className="status-msg">Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h2 className="page-title">Your Cart</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={`${import.meta.env.VITE_API_BASE}${item.image}`} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="product-price">€{item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-controls">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => dispatch(updateQuantity({ _id: item._id, quantity: Number(e.target.value) }))}
              />
              <button type="button" className="remove-btn" onClick={() => dispatch(removeFromCart(item._id))}>
                Remove
              </button>
            </div>
            <p className="cart-item-subtotal">€{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p className="cart-total">Total: €{total.toFixed(2)}</p>
        <button type="button" className="clear-btn" onClick={() => dispatch(clearCart())}>Clear Cart</button>
        <button type="button" className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;