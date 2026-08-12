	import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
	import { supabase } from "../lib/supabase";

type UserProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  account_status: "active" | "suspended";
};

type AccountBalance = {
  balance: number | string;
  currency: string | null;
};

type Deposit = {
  id: string;
  user_id: string;
  amount: number | string;
  currency: string | null;
  status: string;
  reference: string | null;
  created_at: string;
};

type Investment = {
  id: string;
  plan_name: string | null;
  amount: number | string;

  currency: string | null;
  status: string | null;
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
};

type Transaction = {
  id: string;
  user_id: string;
  type: string;
  amount: number | string;
  currency: string | null;
  description: string | null;
  reference: string | null;
  created_at: string;
  status: string | null;
};

type Withdrawal = {
  id: string;
  user_id: string;
  amount: number | string;
  currency: string | null;
  destination: string | null;
  status: string;
  created_at: string;
};

function AdminUser() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] =
    useState<AccountBalance | null>(null);

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [investments, setInvestments] =
    useState<Investment[]>([]);
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const loadUserData = useCallback(async () => {
    try {
      setError("");

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setError("Please sign in.");
        return;
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_super_admin");

      if (adminError) {
        throw adminError;
      }

      if (!isAdmin) {
        setError("Access denied.");
        return;
      }

      setAuthorized(true);

      if (!id) {
        setError("User ID is missing.");
        return;
      }

      const [
        profileResult,
        balanceResult,
        depositsResult,
        investmentsResult,
        transactionsResult,
        withdrawalsResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id,full_name,phone,created_at,account_status"
          )
          .eq("id", id)
          .single(),

        supabase
          .from("account_balances")
          .select("balance,currency")
          .eq("user_id", id)
          .maybeSingle(),

        supabase
          .from("deposits")
          .select(
            "id,user_id,amount,currency,status,reference,created_at"
          )
          .eq("user_id", id)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("investments")
          .select(
            "id,plan_name,amount,currency,status,started_at,ends_at,created_at"
          )
          .eq("user_id", id)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("transactions")
          .select(
            "id,user_id,type,amount,currency,description,reference,created_at,status"
          )
          .eq("user_id", id)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("withdrawals")
          .select(
            "id,user_id,amount,currency,destination,status,created_at"
          )
          .eq("user_id", id)
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (profileResult.error)
        throw profileResult.error;

      if (balanceResult.error)
        throw balanceResult.error;

      if (depositsResult.error)
        throw depositsResult.error;

      if (investmentsResult.error)
        throw investmentsResult.error;

      if (transactionsResult.error)
        throw transactionsResult.error;

      if (withdrawalsResult.error)
        throw withdrawalsResult.error;
console.log("ADMIN BALANCE RESULT:", balanceResult.data);
console.log("ADMIN INVESTMENTS RESULT:", investmentsResult.data);
      setUser(profileResult.data);
      setBalance(balanceResult.data);
      setDeposits(depositsResult.data || []);
      setInvestments(investmentsResult.data || []);
      setTransactions(transactionsResult.data || []);
      setWithdrawals(withdrawalsResult.data || []);
    } catch (err) {
      console.error(
        "Admin user loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load user."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUserData();

    const interval = setInterval(() => {
      loadUserData();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadUserData]);

  async function changeAccountStatus(
    newStatus: "active" | "suspended"
  ) {
    if (!user) return;

    const action =
      newStatus === "suspended"
        ? "suspend"
        : "reactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this account?`
    );

    if (!confirmed) return;

    try {
      setUpdatingStatus(true);
      setError("");

      const { error: updateError } =
        await supabase
          .from("profiles")
          .update({
            account_status: newStatus,
          })
          .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setUser({
        ...user,
        account_status: newStatus,
      });
    } catch (err) {
      console.error(
        "Account status update error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update account status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  function money(
    amount: number | string,
    currency?: string | null
  ) {
    return `${Number(
      amount || 0
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency || "USDT"}`;
  }

  const activeInvestments =
    investments.filter(
      (investment) =>
        String(investment.status || "")
          .trim()
          .toLowerCase() === "active"
    );

  const totalInvested =
    activeInvestments.reduce(
      (sum, investment) =>
        sum + Number(investment.amount || 0),
      0
    );

  const totalDeposits =
    deposits
      .filter(
        (deposit) =>
          String(deposit.status || "")
            .trim()
            .toLowerCase() === "approved"
      )
      .reduce(
        (sum, deposit) =>
          sum + Number(deposit.amount || 0),
        0
      );

  const totalWithdrawals =
    withdrawals
      .filter(
        (withdrawal) =>
          String(withdrawal.status || "")
            .trim()
            .toLowerCase() === "approved"
      )
      .reduce(
        (sum, withdrawal) =>
          sum + Number(withdrawal.amount || 0),
        0
      );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-yellow-400 font-semibold">
          Loading user...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-5">🔒</div>

          <h1 className="text-3xl font-bold">
            Access Denied
          </h1>

          <p className="text-gray-400 mt-3">
            {error}
          </p>

          <Link
            to="/admin"
            className="inline-block mt-7 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            User Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            {error || "This user does not exist."}
          </p>

          <Link
            to="/admin"
            className="inline-block mt-7 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const suspended =
    user.account_status === "suspended";

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-yellow-500/20">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400"
          >
            Amaan Capital
          </Link>

          <Link
            to="/admin"
            className="text-gray-400 hover:text-yellow-400"
          >
            ← Admin Control Center
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-yellow-400 uppercase tracking-widest text-sm font-semibold">
          User Management
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-3">
          User{" "}
          <span className="text-yellow-400">
            Profile
          </span>
        </h1>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4">
            {error}
          </div>
        )}

        <section className="mt-10 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-yellow-400 text-black flex items-center justify-center text-3xl font-extrabold">
              {(user.full_name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.full_name || "Unnamed User"}
              </h2>

              <p className="text-gray-500 mt-1">
                Amaan Capital User
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <div>
              <p className="text-gray-500 text-sm">
                Full Name
              </p>
              <p className="mt-1 font-semibold">
                {user.full_name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Phone
              </p>
              <p className="mt-1 font-semibold">
                {user.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Registered
              </p>
              <p className="mt-1 font-semibold">
                {new Date(
                  user.created_at
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                User ID
              </p>
              <p className="mt-1 text-gray-400 text-xs break-all">
                {user.id}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-5">
            Account Overview
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-500 text-sm">
                Balance
              </p>

              <p className="text-3xl font-bold text-yellow-400 mt-2">
                {money(
                  balance?.balance || 0,
                  balance?.currency
                )}
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-500 text-sm">
                Active Investments
              </p>

              <p className="text-3xl font-bold mt-2">
                {money(totalInvested)}
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-500 text-sm">
                Total Deposits
              </p>

              <p className="text-3xl font-bold mt-2">
                {money(totalDeposits)}
              </p>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-500 text-sm">
                Total Withdrawals
              </p>

              <p className="text-3xl font-bold mt-2">
                {money(totalWithdrawals)}
              </p>
            </div>
          </div>
        </section>
        <section className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h2 className="text-2xl font-bold">
                Account Status
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    suspended
                      ? "bg-red-400"
                      : "bg-green-400"
                  }`}
                />

                <span
                  className={`font-semibold ${
                    suspended
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {suspended ? "Suspended" : "Active"}
                </span>
              </div>
            </div>

            {suspended ? (
              <button
                onClick={() => changeAccountStatus("active")}
                disabled={updatingStatus}
                className="bg-green-500 text-black px-5 py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {updatingStatus
                  ? "Updating..."
                  : "Reactivate Account"}
              </button>
            ) : (
              <button
                onClick={() => changeAccountStatus("suspended")}
                disabled={updatingStatus}
                className="bg-red-500 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {updatingStatus
                  ? "Updating..."
                  : "Suspend Account"}
              </button>
            )}
          </div>

          <p className="text-gray-500 text-sm mt-4">
            Suspending an account does not delete or alter
            the user's financial records.
          </p>
        </section>
        <section className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
          <h2 className="text-2xl font-bold mb-5">
            Deposits
          </h2>

          {deposits.length === 0 ? (
            <p className="text-gray-500">
              No deposits found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {deposits.map((deposit) => (
                    <tr
                      key={deposit.id}
                      className="border-b border-gray-800/70"
                    >
                      <td className="px-4 py-4 font-semibold">
                        {money(
                          deposit.amount,
                          deposit.currency
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {deposit.status}
                      </td>

                      <td className="px-4 py-4 text-gray-400 text-sm">
                        {deposit.reference || "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-400">
                        {new Date(
                          deposit.created_at
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
          <h2 className="text-2xl font-bold mb-5">
            Investments
          </h2>

          {investments.length === 0 ? (
            <p className="text-gray-500">
              No investments found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Started
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Ends
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {investments.map((investment) => (
                    <tr
                      key={investment.id}
                      className="border-b border-gray-800/70"
                    >
                      <td className="px-4 py-4 font-semibold">
                        {investment.plan_name ||
                          "Investment"}
                      </td>

                      <td className="px-4 py-4">
                        {money(
                          investment.amount,
                          investment.currency
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {investment.status ||
                          "Unknown"}
                      </td>

                      <td className="px-4 py-4 text-gray-400">
                        {investment.started_at
                          ? new Date(
                              investment.started_at
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-400">
                        {investment.ends_at
                          ? new Date(
                              investment.ends_at
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
          <h2 className="text-2xl font-bold mb-5">
            Withdrawals
          </h2>

          {withdrawals.length === 0 ? (
            <p className="text-gray-500">
              No withdrawals found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="border-b border-gray-800/70"
                    >
                      <td className="px-4 py-4 font-semibold">
                        {money(
                          withdrawal.amount,
                          withdrawal.currency
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {withdrawal.status}
                      </td>

                      <td className="px-4 py-4 text-gray-400 text-sm break-all">
                        {withdrawal.destination ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-400">
                        {new Date(
                          withdrawal.created_at
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 mb-12 bg-gray-900/70 border border-gray-800 rounded-3xl p-7">
          <h2 className="text-2xl font-bold mb-5">
            Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Type
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Status
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Description
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-gray-500 text-sm">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-800/70"
                      >
                        <td className="px-4 py-4 font-semibold">
                          {transaction.type}
                        </td>

                        <td className="px-4 py-4">
                          {money(
                            transaction.amount,
                            transaction.currency
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {transaction.status ||
                            "Unknown"}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {transaction.description ||
                            "—"}
                        </td>

                        <td className="px-4 py-4 text-gray-400 text-sm">
                          {transaction.reference ||
                            "—"}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {new Date(
                            transaction.created_at
                          ).toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminUser;
