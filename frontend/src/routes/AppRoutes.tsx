import AdminKYC from "../pages/AdminKYC";import AppShell from "../components/AppShell";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import KYC from "../pages/KYC";
import Home from "../pages/Home";
import Markets from "../pages/Markets";
import About from "../pages/About";
import Plans from "../pages/Plans";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Investments from "../pages/Investments";
import InvestmentDetails from "../pages/InvestmentDetails";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import ForgotPassword from "../pages/ForgotPassword";
import Deposit from "../pages/Deposit";
import Withdraw from "../pages/Withdraw";
import ResetPassword from "../pages/ResetPassword";
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
  path="/reset-password"
  element={<ResetPassword />}
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
  path="/kyc"
  element={<KYC />}
/>
        <Route
          path="/login"
          element={<Login />}
        />
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
        <Route
          path="/register"
          element={<Register />}
        />

        {/* USER APPLICATION */}

        <Route element={<AppShell />}>
<Route
  path="/notifications"
  element={<Notifications />}
/>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/markets"
            element={<Markets />}
          />

          <Route
            path="/investments"
            element={<Investments />}
          />

          <Route
            path="/investments/:id"
            element={<InvestmentDetails />}
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
  path="/admin/kyc"
  element={<AdminKYC />}
/>
          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        {/* ADMIN PAGES */}

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/admin/user/:id"
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
