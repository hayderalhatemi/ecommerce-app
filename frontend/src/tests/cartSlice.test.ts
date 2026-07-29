import { describe, expect, it } from "vitest";
import cartReducer, {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../store/slices/cartSlice";

const initialState = { items: [] };

const sampleItem = {
  _id: "1",
  name: "Test Product",
  price: 29.99,
  image: "test.jpg",
  quantity: 1,
};

describe("cartSlice", () => {
  it("adds a new item to an empty cart", () => {
    const state = cartReducer(initialState, addToCart(sampleItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(sampleItem);
  });

  it("increases quantity when adding an existing item", () => {
    const stateWithItem = { items: [sampleItem] };
    const state = cartReducer(
      stateWithItem,
      addToCart({ ...sampleItem, quantity: 2 }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("removes an item from the cart", () => {
    const stateWithItem = { items: [sampleItem] };
    const state = cartReducer(stateWithItem, removeFromCart("1"));
    expect(state.items).toHaveLength(0);
  });

  it("updates the quantity of an item", () => {
    const stateWithItem = { items: [sampleItem] };
    const state = cartReducer(
      stateWithItem,
      updateQuantity({ _id: "1", quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it("clears all items from the cart", () => {
    const stateWithItem = { items: [sampleItem] };
    const state = cartReducer(stateWithItem, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
