import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Markets from "../pages/Markets";
import About from "../pages/About";
import Plans from "../pages/Plans";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";

import Deposit from "../pages/Deposit";
import Withdraw from "../pages/Withdraw";

import Admin from "../pages/Admin";
import AdminUser from "../pages/AdminUser";
import AdminWallets from "../pages/AdminWallets";
import AdminDeposits from "../pages/AdminDeposits";
import AdminWithdrawals from "../pages/AdminWithdrawals";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC PAGES */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/markets"
          element={<Markets />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/plans"
          element={<Plans />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* USER PAGES */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/deposit"
          element={<Deposit />}
        />

        <Route
          path="/withdraw"
          element={<Withdraw />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        {/* ADMIN PAGES */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/admin/user"
          element={<AdminUser />}
        />

        <Route
          path="/admin/wallets"
          element={<AdminWallets />}
        />

        <Route
          path="/admin/deposits"
          element={<AdminDeposits />}
        />

        <Route
          path="/admin/withdrawals"
          element={<AdminWithdrawals />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
