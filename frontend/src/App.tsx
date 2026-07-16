import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products/:id" element={<div>Product Detail Page</div>} />
          <Route path="/cart" element={<div>Cart Page</div>} />
          <Route path="/orders" element={<div>Orders Page</div>} />
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;