import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/products/:id" element={<div>Product Detail Page</div>} />
        <Route path="/cart" element={<div>Cart Page</div>} />
        <Route path="/orders" element={<div>Orders Page</div>} />
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;