import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type ApplicationStatus = "pending" | "approved" | "rejected";

type GrowthPartnerApplication = {
  id: string;
  full_name: string;
  email: string;
  location: string;
  country: string;
  experience: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

function AdminGrowthPartners() {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<
    GrowthPartnerApplication[]
  >([]);
  const [selected, setSelected] =
    useState<GrowthPartnerApplication | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: applicationsError } = await supabase
        .from("growth_partner_applications")
        .select(
          "id,full_name,email,location,country,experience,status,created_at,updated_at"
        )
        .order("created_at", { ascending: false });

      if (applicationsError) {
        throw applicationsError;
      }

      setApplications(
        (data || []) as GrowthPartnerApplication[]
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Growth Partner applications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
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
        await loadApplications();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify administrator access."
        );
      } finally {
        setChecking(false);
      }
    }

    initialize();
  }, [navigate, loadApplications]);

  async function updateStatus(
    application: GrowthPartnerApplication,
    status: ApplicationStatus
  ) {
    setUpdating(true);
    setError("");

    try {
      const { data, error: updateError } = await supabase
        .from("growth_partner_applications")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id)
        .select(
          "id,full_name,email,location,country,experience,status,created_at,updated_at"
        )
        .single();

      if (updateError) {
        throw updateError;
      }

      const updated =
        data as GrowthPartnerApplication;

      setApplications((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      setSelected(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update application."
      );
    } finally {
      setUpdating(false);
    }
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function statusClass(status: ApplicationStatus) {
    if (status === "approved") {
      return "border-green-500/30 bg-green-500/10 text-green-400";
    }

    if (status === "rejected") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-400">
            Verifying administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">
            Administrator Access Required
          </h1>

          <p className="mt-4 text-gray-400">
            {error || "You do not have administrator access."}
          </p>

          <Link
            to="/admin"
            className="mt-8 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = applications.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">
              Amaan Capital
            </p>

            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Growth Partners
            </h1>

            <p className="mt-2 text-gray-400">
              Review and manage Local Growth Partner applications.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin"
              className="rounded-xl border border-gray-700 px-4 py-3 font-semibold text-gray-300 hover:border-gray-500"
            >
              Admin Dashboard
            </Link>

            <button
              type="button"
              onClick={loadApplications}
              disabled={loading}
              className="rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-2 text-3xl font-extrabold text-yellow-400">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="mt-2 text-3xl font-extrabold text-green-400">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="mt-2 text-3xl font-extrabold text-red-400">
              {rejectedCount}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-800 bg-gray-950">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-gray-800 bg-black">
                <tr>
                  <th className="px-5 py-4 text-sm text-gray-500">
                    Applicant
                  </th>
                  <th className="px-5 py-4 text-sm text-gray-500">
                    Location
                  </th>
                  <th className="px-5 py-4 text-sm text-gray-500">
                    Country
                  </th>
                  <th className="px-5 py-4 text-sm text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-sm text-gray-500">
                    Submitted
                  </th>
                  <th className="px-5 py-4 text-sm text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center text-gray-500"
                    >
                      {loading
                        ? "Loading applications..."
                        : "No Growth Partner applications yet."}
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr
                      key={application.id}
                      className="border-b border-gray-900"
                    >
                      <td className="px-5 py-5">
                        <p className="font-bold">
                          {application.full_name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {application.email}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-gray-300">
                        {application.location}
                      </td>

                      <td className="px-5 py-5 text-gray-300">
                        {application.country}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-500">
                        {formatDate(application.created_at)}
                      </td>

                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            setSelected(application)
                          }
                          className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-bold hover:border-yellow-400 hover:text-yellow-400"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                    Growth Partner Application
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold">
                    {selected.full_name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl border border-gray-700 px-3 py-2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-gray-600">
                    Email
                  </p>
                  <p className="mt-1 break-all text-gray-200">
                    {selected.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-600">
                    Location
                  </p>
                  <p className="mt-1 text-gray-200">
                    {selected.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-600">
                    Country
                  </p>
                  <p className="mt-1 text-gray-200">
                    {selected.country}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-600">
                    Submitted
                  </p>
                  <p className="mt-1 text-gray-200">
                    {formatDate(selected.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs uppercase text-gray-600">
                  Experience / Community Network
                </p>

                <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-gray-800 bg-black p-5 leading-7 text-gray-300">
                  {selected.experience}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs uppercase text-gray-600">
                  Application Status
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      updateStatus(selected, "pending")
                    }
                    className="rounded-xl border border-yellow-500/30 px-4 py-3 font-bold text-yellow-400 disabled:opacity-50"
                  >
                    Pending
                  </button>

                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      updateStatus(selected, "approved")
                    }
                    className="rounded-xl border border-green-500/30 px-4 py-3 font-bold text-green-400 disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      updateStatus(selected, "rejected")
                    }
                    className="rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-400 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {updating && (
                <p className="mt-4 text-sm text-gray-500">
                  Updating application...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGrowthPartners;
