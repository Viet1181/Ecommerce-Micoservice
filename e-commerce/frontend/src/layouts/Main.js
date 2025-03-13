import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
import ListingGrid from "./ListingGrid";
import DetailProduct from "./DetailProduct";
import Profile from "./Profile";
import ProfileAddress from "./ProfileAddress";
import ProfileOrders from "./ProfileOrders";
import ProfileSettings from "./ProfileSettings";
import Logout from "./Logout";
import Cart from "./Cart";
import Checkout from "./Checkout";
import ChangePassword from "./ChangePassword";
import PaymentResult from "./PaymentResult";
import PaymentSuccess from "./PaymentSuccess";
import PaymentCancel from "./PaymentCancel";
import ReviewProduct from "./ReviewProduct";

const Main = () => (
  <main className="main">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<UserLogin />} />
      <Route path="/Register" element={<UserRegister />} />
      <Route path="/ListingGrid" element={<ListingGrid />} />
      <Route path="/Detail" element={<DetailProduct />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Profile/Address" element={<ProfileAddress />} />
      <Route path="/Profile/Orders" element={<ProfileOrders />} />
      <Route path="/Profile/Settings" element={<ProfileSettings />} />
      <Route path="/Logout" element={<Logout />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/Checkout" element={<Checkout />} />
      <Route path="/Payment/Success" element={<PaymentSuccess />} />
      <Route path="/Payment/Cancel" element={<PaymentCancel />} />
      <Route path="/Change-password" element={<ChangePassword />} />
      <Route path="/Shop/Orders/Success" element={<PaymentResult />} />
      <Route path="/Shop/Orders/Cancel" element={<PaymentResult />} />
      <Route path="/products/review" element={<ReviewProduct />} />
    </Routes>
  </main>
);

export default Main;
