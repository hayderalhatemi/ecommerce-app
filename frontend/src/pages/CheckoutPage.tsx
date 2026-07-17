import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart } from "../store/slices/cartSlice";
import api from "../api/axios";

interface ShippingForm {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ShippingForm>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data: ShippingForm) => {
    try {
      await api.post("/orders", {
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: data,
      });
      dispatch(clearCart());
      navigate("/orders");
    } catch {
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Shipping Details</h2>
      <div className="checkout-summary">
        <p>Items: {items.length}</p>
        <p className="cart-total">Total: €{total.toFixed(2)}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input id="address" type="text" {...register("address", { required: "Address is required" })} />
          {errors.address && <span className="error">{errors.address.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input id="city" type="text" {...register("city", { required: "City is required" })} />
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input id="postalCode" type="text" {...register("postalCode", { required: "Postal code is required" })} />
          {errors.postalCode && <span className="error">{errors.postalCode.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input id="country" type="text" {...register("country", { required: "Country is required" })} />
          {errors.country && <span className="error">{errors.country.message}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;