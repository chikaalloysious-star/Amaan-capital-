import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type AdminUser = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

type AdminStats = {
  users: number;
  deposits: number;
  pending_deposits: number;
  withdrawals: number;
  pending_withdrawals: number;
  active_investments: number;
  invested_amount: number;
};

const defaultStats: AdminStats = {
  users: 0,
  deposits: 0,
  pending_deposits: 0,
  withdrawals: 0,
  pending_withdrawals: 0,
  active_investments: 0,
  invested_amount: 0,
};

function Admin() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>(defaultStats);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);

    try {
      const { data, error: usersError } =
        await supabase.rpc("get_admin_users");

      if (usersError) {
        throw usersError;
      }

      setUsers((data || []) as AdminUser[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load users."
      );
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);

    try {
      const { data, error: statsError } =
        await supabase.rpc("get_admin_dashboard_stats");

      if (statsError) {
        throw statsError;
      }

      console.log("ADMIN STATS RPC:", data);

      if (!data) {
        throw new Error(
          "The dashboard statistics function returned no data."
        );
      }

      setStats({
        users: Number(data.users ?? 0),
        deposits: Number(data.deposits ?? 0),
        pending_deposits: Number(data.pending_deposits ?? 0),
        withdrawals: Number(data.withdrawals ?? 0),
        pending_withdrawals: Number(
          data.pending_withdrawals ?? 0
        ),
        active_investments: Number(
          data.active_investments ?? 0
        ),
        invested_amount: Number(
          data.invested_amount ?? 0
        ),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard statistics."
      );
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    setError("");

    await Promise.all([
      loadUsers(),
      loadStats(),
    ]);
  }, [loadUsers, loadStats]);

  useEffect(() => {
    async function initializeAdmin() {
      try {
        setError("");

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error: roleError } =
          await supabase.rpc("is_super_admin");

        if (roleError) {
          throw roleError;
        }

        if (!data) {
          setError(
            "You do not have administrator access."
          );
          return;
        }

        setAuthorized(true);

        await refreshDashboard();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load administrator dashboard."
        );
      } finally {
        setChecking(false);
      }
    }

    initializeAdmin();
  }, [navigate, refreshDashboard]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function formatMoney(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Verifying administrator access...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="text-5xl mb-6">
            🔒
          </div>

          <h1 className="text-3xl font-bold">
            Access Denied
          </h1>

          <p className="text-gray-400 mt-3">
            {error ||
              "You do not have permission to access this area."}
          </p>

          <Link
            to="/dashboard"
            className="inline-block mt-7 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Return to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}

      <header className="border-b border-yellow-500/20 bg-black sticky top-0 z-40">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <div className="flex items-center gap-5">

            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-yellow-400 transition"
            >
              User Dashboard
            </Link>

            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-red-400 transition"
            >
              Sign Out
            </button>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* TITLE */}

        <section className="mb-10">

          <p className="text-yellow-400 font-semibold uppercase tracking-widest text-sm">
            Owner Control Center
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mt-3">
            Amaan Capital{" "}
            <span className="text-yellow-400">
              Admin
            </span>
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl">
            Central command center for monitoring and
            managing the Amaan Capital platform.
          </p>

        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-8 border border-red-500/30 bg-red-500/10 rounded-2xl p-5 text-red-300">
            <p className="font-semibold">
              Admin Dashboard Error
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>
          </div>
        )}

        {/* REFRESH */}

        <div className="flex justify-end mb-5">

          <button
            onClick={refreshDashboard}
            disabled={loadingStats || loadingUsers}
            className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loadingStats || loadingUsers
              ? "Refreshing..."
              : "Refresh Dashboard"}
          </button>

        </div>

        {/* MAIN STATISTICS */}

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* USERS */}

          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Registered Users
            </p>

            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {stats.users}
            </p>

            <p className="text-gray-600 text-xs mt-2">
              Total platform accounts
            </p>

          </div>

          {/* DEPOSITS */}

          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Approved Deposits
            </p>

            <p className="text-3xl font-bold mt-2">
              {formatMoney(stats.deposits)}
            </p>

            <p className="text-yellow-400 text-xs mt-2">
              {stats.pending_deposits} pending
            </p>

          </div>

          {/* INVESTMENTS */}

          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Active Investments
            </p>

            <p className="text-3xl font-bold mt-2">
              {stats.active_investments}
            </p>

            <p className="text-gray-500 text-xs mt-2">
              {formatMoney(stats.invested_amount)} currently invested
            </p>

          </div>

          {/* WITHDRAWALS */}

          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">

            <p className="text-gray-500 text-sm">
              Approved Withdrawals
            </p>

            <p className="text-3xl font-bold mt-2">
              {formatMoney(stats.withdrawals)}
            </p>

            <p className="text-yellow-400 text-xs mt-2">
              {stats.pending_withdrawals} pending
            </p>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="mt-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold">
              Quick Actions
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Access the major platform management areas.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <Link
              to="/admin/deposits"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                💰
              </div>

              <h3 className="font-bold text-lg">
                Deposits
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Review and approve deposit requests.
              </p>

              {stats.pending_deposits > 0 && (
                <p className="text-yellow-400 text-sm font-semibold mt-4">
                  {stats.pending_deposits} pending
                </p>
              )}

            </Link>
<Link
  to="/admin/kyc"
  className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
>
  <div className="text-3xl mb-4">
    🪪
  </div>

  <h3 className="font-bold text-lg">
    KYC Verification
  </h3>

  <p className="text-gray-500 text-sm mt-2">
    Review and approve user identity verification applications.
  </p>
</Link>
            <Link
              to="/admin/withdrawals"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                💸
              </div>

              <h3 className="font-bold text-lg">
                Withdrawals
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Review and process withdrawal requests.
              </p>

              {stats.pending_withdrawals > 0 && (
                <p className="text-yellow-400 text-sm font-semibold mt-4">
                  {stats.pending_withdrawals} pending
                </p>
              )}

            </Link>

            <Link
              to="/admin/wallets"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                🏦
              </div>

              <h3 className="font-bold text-lg">
                Wallets
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Manage receiving wallets for deposits.
              </p>

            </Link>

            <Link
              to="/admin#registered-users"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                👥
              </div>

              <h3 className="font-bold text-lg">
                Users
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                View registered platform accounts.
              </p>

            </Link>

          </div>

        </section>

        {/* REGISTERED USERS */}

        <section className="mt-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

            <div>

              <h2 className="text-2xl font-bold">
                Registered Users
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Accounts registered on Amaan Capital.
              </p>

            </div>

            <button
              onClick={loadUsers}
              disabled={loadingUsers}
              className="bg-gray-800 text-white px-5 py-2 rounded-xl font-bold hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loadingUsers
                ? "Refreshing..."
                : "Refresh Users"}
            </button>

          </div>

          <div className="bg-gray-900/70 border border-gray-800 rounded-3xl overflow-hidden">

            {loadingUsers ? (

              <div className="p-10 text-center text-yellow-400">
                Loading users...
              </div>

            ) : users.length === 0 ? (

              <div className="p-10 text-center text-gray-500">
                No registered users found.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="border-b border-gray-800">

                    <tr >

                      <th className="px-6 py-4 text-gray-500 text-sm">
                        Name
                      </th>

                      <th className="px-6 py-4 text-gray-500 text-sm">
                        Phone
                      </th>

                      <th className="px-6 py-4 text-gray-500 text-sm">
                        Registered
                      </th>

                      <th className="px-6 py-4 text-gray-500 text-sm">
                        User ID
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.map((user) => (

                      <tr 
                        key={user.id} onClick={() => navigate(`/admin/user/${user.id}`)}
                        className="border-b border-gray-800/70 last:border-0 hover:bg-gray-800/40 transition"
                      >

                        <td className="px-6 py-5 font-semibold">
                          {user.full_name || "Unnamed user"}
                        </td>

                        <td className="px-6 py-5 text-gray-400">
                          {user.phone || "Not provided"}
                        </td>

                        <td className="px-6 py-5 text-gray-400">
                          {new Date(
                            user.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-5 text-gray-600 text-xs">
                          {user.id}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

        {/* PLATFORM MANAGEMENT */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Platform Management
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

            <Link
              to="/admin#registered-users"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                👥
              </div>

              <h3 className="font-bold text-lg">
                Users
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Manage registered accounts.
              </p>

            </Link>

            <Link
              to="/plans"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                📈
              </div>

              <h3 className="font-bold text-lg">
                Investment Plans
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                View the platform investment plans.
              </p>

            </Link>

            <Link
              to="/admin/deposits"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                💰
              </div>

              <h3 className="font-bold text-lg">
                Deposits
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Monitor platform deposits.
              </p>

            </Link>

            <Link
              to="/admin/withdrawals"
              className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition"
            >

              <div className="text-3xl mb-4">
                💸
              </div>

              <h3 className="font-bold text-lg">
                Withdrawals
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Review withdrawal requests.
              </p>

            </Link>

          </div>

        </section>

        {/* PLATFORM STATUS */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Platform Status
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">

              <p className="text-gray-500 text-sm">
                Authentication
              </p>

              <p className="text-green-400 font-bold mt-2">
                ● Operational
              </p>

            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">

              <p className="text-gray-500 text-sm">
                Database
              </p>

              <p className="text-green-400 font-bold mt-2">
                ● Operational
              </p>

            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">

              <p className="text-gray-500 text-sm">
                Financial Engine
              </p>

              <p className="text-green-400 font-bold mt-2">
                ● Operational
              </p>

            </div>

          </div>

        </section>

        {/* SUPER ADMIN */}

        <section className="mt-10 border border-yellow-500/20 bg-yellow-500/5 rounded-2xl p-6">

          <p className="text-yellow-400 font-semibold">
            👑 Super Admin
          </p>

          <p className="text-gray-400 text-sm mt-2">
            Your account has full Amaan Capital administrator privileges.
          </p>

        </section>

      </main>

    </div>
  );
}

export default Admin;
