import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "../components/Navbar";
import authReducer from "../store/slices/authSlice";
import cartReducer from "../store/slices/cartSlice";

const renderNavbar = (preloadedState: any) => {
  const store = configureStore({
    reducer: { auth: authReducer, cart: cartReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Navbar", () => {
  it("shows Login and Register when logged out", () => {
    renderNavbar({ auth: { user: null }, cart: { items: [] } });

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("shows My Orders and Logout when logged in", () => {
    renderNavbar({
      auth: { user: { name: "Test User", role: "user" } },
      cart: { items: [] },
    });

    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("shows Admin link only for admin users", () => {
    renderNavbar({
      auth: { user: { name: "Admin", role: "admin" } },
      cart: { items: [] },
    });

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not show Admin link for regular users", () => {
    renderNavbar({
      auth: { user: { name: "Test User", role: "user" } },
      cart: { items: [] },
    });

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("displays correct cart item count", () => {
    renderNavbar({
      auth: { user: null },
      cart: {
        items: [
          { _id: "1", name: "A", price: 10, image: "", quantity: 2 },
          { _id: "2", name: "B", price: 20, image: "", quantity: 3 },
        ],
      },
    });

    expect(screen.getByText("Cart (5)")).toBeInTheDocument();
  });
});
