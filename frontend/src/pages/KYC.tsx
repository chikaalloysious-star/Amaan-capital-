import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type KYCStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected";

type KYCRecord = {
  id: string;
  status: KYCStatus;
  full_name: string | null;
  date_of_birth: string | null;
  country: string | null;
  address: string | null;
  id_type: string | null;
  id_number: string | null;
  document_url: string | null;
  rejection_reason: string | null;
};

function KYC() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [kyc, setKyc] = useState<KYCRecord | null>(null);

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadKYC() {
      try {
        setError("");

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error: kycError } = await supabase
          .from("kyc_verifications")
          .select(
            "id,status,full_name,date_of_birth,country,address,id_type,id_number,document_url,rejection_reason"
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (kycError) {
          throw kycError;
        }

        if (data) {
          setKyc(data as KYCRecord);
          setFullName(data.full_name || "");
          setDateOfBirth(data.date_of_birth || "");
          setCountry(data.country || "");
          setAddress(data.address || "");
          setDocumentType(data.id_type || "");
          setDocumentNumber(data.id_number || "");
        }
      } catch (err) {
        console.error("KYC loading error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your KYC information."
        );
      } finally {
        setLoading(false);
      }
    }

    loadKYC();
  }, [navigate]);

  async function submitKYC(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !fullName.trim() ||
      !dateOfBirth ||
      !country.trim() ||
      !address.trim() ||
      !documentType ||
      !documentNumber.trim() ||
      !documentFile
    ) {
      setError("Please complete all fields and upload your document.");
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      /*
       * Step 1: upload the document.
       */
      const extension =
        documentFile.name.split(".").pop()?.toLowerCase() || "file";

      const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("kyc-documents")
        .upload(filePath, documentFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Document upload failed: ${uploadError.message}`);
      }

      /*
       * Step 2: create the KYC record.
       */
      const { data: insertedRecord, error: insertError } = await supabase
        .from("kyc_verifications")
        .insert({
          user_id: user.id,
          status: "pending",
          full_name: fullName.trim(),
          date_of_birth: dateOfBirth,
          country: country.trim(),
          address: address.trim(),
          id_type: documentType,
          id_number: documentNumber.trim(),
          document_url: filePath,
          rejection_reason: null,
          submitted_at: new Date().toISOString(),
          reviewed_at: null,
          reviewed_by: null,
        })
        .select(
          "id,status,full_name,date_of_birth,country,address,id_type,id_number,document_url,rejection_reason"
        )
        .single();

      if (insertError) {
        /*
         * The document uploaded successfully, but the database
         * insert failed. Show the actual database error.
         */
        console.error("KYC database insert error:", insertError);

        throw new Error(
          `KYC database error: ${insertError.message}`
        );
      }

      setKyc(insertedRecord as KYCRecord);
      setSuccess(
        "Your KYC information has been submitted successfully and is now under review."
      );

      setDocumentFile(null);
    } catch (err) {
      console.error("KYC submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your KYC information."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="font-semibold text-yellow-400">
          Loading KYC...
        </p>
      </div>
    );
  }

  const status = kyc?.status || "not_submitted";

  if (status === "approved") {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8 text-center">
            <div className="text-5xl">✓</div>

            <h1 className="mt-5 text-3xl font-extrabold">
              KYC Verified
            </h1>

            <p className="mt-3 text-gray-400">
              Your identity has been successfully verified.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-7 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-8 text-center">
            <div className="text-5xl">⏳</div>

            <h1 className="mt-5 text-3xl font-extrabold">
              KYC Under Review
            </h1>

            <p className="mt-3 text-gray-400">
              Your verification documents have been submitted.
              Our team will review them shortly.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-7 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-3xl px-6 py-10 md:py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
            Account Verification
          </p>

          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
            Identity{" "}
            <span className="text-yellow-400">
              Verification
            </span>
          </h1>

          <p className="mt-3 text-gray-400">
            Complete your KYC verification to help us protect your
            account and maintain a secure platform.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">Submission failed</p>
            <p className="mt-2 break-words text-sm">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-green-300">
            {success}
          </div>
        )}

        {status === "rejected" && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="font-bold text-red-400">
              Your previous verification was rejected.
            </p>

            {kyc?.rejection_reason && (
              <p className="mt-2 text-sm text-gray-400">
                Reason: {kyc.rejection_reason}
              </p>
            )}

            <p className="mt-2 text-sm text-gray-500">
              Please correct the information and submit again.
            </p>
          </div>
        )}

        <form
          onSubmit={submitKYC}
          className="space-y-6 rounded-3xl border border-gray-800 bg-gray-950 p-6 md:p-8"
        >
          <div>
            <label className="text-sm font-semibold text-gray-300">
              Full Name
            </label>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Enter your full legal name"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">
              Date of Birth
            </label>

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">
              Country
            </label>

            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Country of residence"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">
              Address
            </label>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Enter your residential address"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">
              Identification Document
            </label>

            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              <option value="">Select document type</option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID</option>
              <option value="drivers_license">
                Driver&apos;s License
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">
              Document Number
            </label>

            <input
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Enter document number"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300">
              Upload Document
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={(e) =>
                setDocumentFile(e.target.files?.[0] || null)
              }
              className="mt-2 block w-full rounded-xl border border-gray-800 bg-black p-3 text-sm text-gray-400"
            />

            <p className="mt-2 text-xs text-gray-600">
              Accepted formats: JPG, PNG or PDF.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit KYC Verification"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default KYC;
