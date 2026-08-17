import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  children: React.ReactNode;
};

function MaintenanceGuard({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: admin } =
            await supabase.rpc("is_super_admin");

          setIsAdmin(Boolean(admin));
        }

        const { data, error } = await supabase
          .from("platform_settings")
          .select("maintenance_mode")
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setMaintenance(Boolean(data.maintenance_mode));
        }
      } catch (error) {
        console.error("Maintenance check error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkMaintenance();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-yellow-400">
            Amaan Capital
          </div>
          <p className="mt-3 text-gray-500">
            Checking platform status...
          </p>
        </div>
      </div>
    );
  }

  if (maintenance && !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <div className="text-6xl">🔧</div>

          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-yellow-400 font-semibold">
            Amaan Capital
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">
            Platform Maintenance
          </h1>

          <p className="mt-5 text-gray-400 leading-7">
            Amaan Capital is temporarily unavailable while we perform
            scheduled maintenance and improvements.
          </p>

          <p className="mt-4 text-gray-500">
            Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default MaintenanceGuard;
