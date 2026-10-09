// src/pages/ResumeList.jsx
// First page of "Resume builder": fancy heading, create new on top, saved resumes below.
// Each saved resume shows a tiny live thumbnail, so GET /resume must return the full documents.
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { deleteResume, getMyResumes } from "../../services/operation/resumeApi";
import ResumePreview from "./ResumePreview";

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

export default function ResumeList() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [resumes, setResumes] = useState(null); // null = still loading
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMyResumes(token)
      .then((list) => setResumes(Array.isArray(list) ? list : []))
      .catch((e) => {
        setError(e.message);
        setResumes([]);
      });
  }, [token]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      await deleteResume(id, token);
      setResumes((list) => list.filter((r) => r._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* hero: fancy heading + create new */}
        <div className="rounded-3xl border border-white/10 bg-[#111111] px-6 py-16 text-center sm:px-12">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Turn your work into
            <br />
            <span className="text-neutral-500">a resume that gets replies</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-400">
            Fill in the form once, preview the page exactly as a recruiter will see it, and
            download a clean PDF that applicant tracking systems can read.
          </p>
          <button
            onClick={() => navigate("/resume-builder/new")}
            className="mt-8 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            + Create new resume
          </button>
        </div>

        {/* saved resumes */}
        <div className="mt-12 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-neutral-100">Your resumes</h2>
          {resumes && resumes.length > 0 && (
            <span className="text-sm text-neutral-400">{resumes.length} saved</span>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {resumes === null && (
          <p className="mt-10 text-center text-neutral-400">Loading your resumes…</p>
        )}

        {resumes && resumes.length === 0 && !error && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 py-14 text-center">
            <p className="text-lg text-neutral-100">Start your first resume</p>
            <p className="mt-1 text-sm text-neutral-400">
              Resumes you save will show up here, ready to edit or download.
            </p>
          </div>
        )}

        {resumes && resumes.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r) => (
              <div
                key={r._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111]"
              >
                {/* live thumbnail */}
                <button
                  onClick={() => navigate(`/resume-builder/${r._id}`)}
                  aria-label={`Edit ${r.title || "resume"}`}
                  className="block bg-[#0a0a0a] p-4 hover:bg-[#161616]"
                >
                  <div className="pointer-events-none aspect-[210/297] overflow-hidden rounded-md bg-white shadow-lg shadow-black/50">
                    <ResumePreview resume={r} compact />
                  </div>
                </button>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="truncate text-base font-semibold text-neutral-100">
                    {r.title || "Untitled resume"}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    Last edited {formatDate(r.updatedAt || r.createdAt)}
                  </p>

                  {confirmId === r._id ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-red-200">Delete this resume?</span>
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                        className="rounded-md bg-red-500/80 px-3 py-1 hover:bg-red-500 disabled:opacity-60"
                      >
                        {deletingId === r._id ? "Deleting…" : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-2 py-1 text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/resume-builder/${r._id}`)}
                        className="flex-1 rounded-lg bg-white py-2 text-sm font-medium text-black hover:bg-neutral-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmId(r._id)}
                        className="rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
