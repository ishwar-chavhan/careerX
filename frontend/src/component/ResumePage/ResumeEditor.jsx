// src/pages/ResumeEditor.jsx
// Routes:  /resume-builder/new  (create)   and   /resume-builder/:id  (edit)
// A toggle at the top switches between "Edit" (the form) and "Preview" (the real resume page).
import { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import {
  createResume,
  getResumeById,
  improveResumePoints,
  updateResume,
} from "../../services/operation/resumeApi";
import ResumePreview, { Rich } from "./ResumePreview";

/* ---------- blank rows + sections (change fields here) ---------- */
const BLANK = {
  skills: () => ({ category: "", items: "" }),
  experience: () => ({
    company: "", location: "", role: "", startDate: "", endDate: "", current: false, pointsText: "",
  }),
  projects: () => ({ name: "", pointsText: "" }),
  education: () => ({ institution: "", location: "", degree: "", startYear: "", endYear: "" }),
};

// [field, label, placeholder]
const SECTIONS = [
  {
    key: "skills",
    title: "Technical skills",
    add: "Add skill row",
    fields: [
      ["category", "Category", "Programming"],
      ["items", "Skills", "C, C++, JavaScript (ES6+), HTML5, CSS3"],
    ],
  },
  {
    key: "experience",
    title: "Work experience",
    add: "Add experience",
    fields: [
      ["company", "Company", "Acme Technologies"],
      ["location", "Location", "Pune, India"],
      ["role", "Role", "Frontend Developer Intern"],
    ],
    dates: "month",
    pointsPlaceholder: "Built a **React dashboard** used by 200+ users\nCut page load time by 40%",
  },
  {
    key: "projects",
    title: "Projects",
    add: "Add project",
    fields: [["name", "Project name", "StudyNotion – EdTech Learning Platform"]],
    pointsPlaceholder:
      "Built a full-stack **MERN EdTech platform** with two user roles\nIntegrated **Razorpay** payments with server-side verification",
  },
  {
    key: "education",
    title: "Education",
    add: "Add education",
    fields: [
      ["institution", "Institution", "JSPM's Rajarshi Shahu College of Engineering"],
      ["location", "Location", "Pune, India"],
      ["degree", "Degree and score", "B.Tech in Electrical Engineering – CGPA: 7.9"],
    ],
    dates: "year",
  },
];

const emptyContact = {
  fullName: "", location: "", email: "", phone: "",
  linkedin: "", github: "", leetcode: "", portfolio: "",
};

const initialForm = () => ({
  title: "",
  contact: { ...emptyContact },
  skills: [
    { category: "Programming", items: "" },
    { category: "Frameworks", items: "" },
    { category: "Tools", items: "" },
  ],
  experience: [],
  projects: [BLANK.projects()],
  education: [BLANK.education()],
});

/* ---------- form state  <->  backend shape ---------- */
// In the form, bullet points are one textarea (one point per line).
// In the backend they are an array of strings called `points`.
const toText = (arr) => (Array.isArray(arr) ? arr.join("\n") : "");
const toPoints = (text = "") => text.split("\n").map((s) => s.trim()).filter(Boolean);
const withPoints = ({ pointsText = "", ...rest }) => ({ ...rest, points: toPoints(pointsText) });

const toBackend = (f) => ({
  title: f.title.trim() || "Untitled resume",
  contact: f.contact,
  skills: f.skills,
  experience: f.experience.map(withPoints),
  projects: f.projects.map(withPoints),
  education: f.education,
});

const fromBackend = (r) => ({
  title: r.title || "",
  contact: { ...emptyContact, ...(r.contact || {}) },
  skills: (r.skills || []).map((s) => ({ category: s.category || "", items: s.items || "" })),
  experience: (r.experience || []).map((e) => ({ ...BLANK.experience(), ...e, pointsText: toText(e.points) })),
  projects: (r.projects || []).map((p) => ({ ...BLANK.projects(), ...p, pointsText: toText(p.points) })),
  education: (r.education || []).map((e) => ({ ...BLANK.education(), ...e })),
});

/* ---------- small UI pieces (outside the page so inputs keep focus) ---------- */
const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 " +
  "focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 [color-scheme:dark]";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-400">{label}</span>
      {children}
    </label>
  );
}

function Card({ title, hint, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
      <h2 className="text-base font-semibold text-neutral-100">{title}</h2>
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* Bullet points textarea + "Improve with AI" (calls POST /resume/ai-improve-description) */
function PointsField({ sectionKey, item, placeholder, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState(null); // { source, points }
  const { token } = useContext(AuthContext);

  const text = item.pointsText || "";
  // only show the suggestion while the text is still the one it was made from
  const showSuggestion = suggestion && suggestion.source === text && suggestion.points.length > 0;

  const improve = async () => {
    if (!text.trim()) {
      setError("Write a few points first, then AI can polish them.");
      return;
    }
    setBusy(true);
    setError("");
    setSuggestion(null);
    try {
      const isProject = sectionKey === "projects";
      const points = await improveResumePoints({
        type: isProject ? "project" : "workExperience",
        title: isProject ? item.name : item.role,
        organization: isProject ? "" : item.company,
        startDate: item.startDate || "",
        endDate: item.current ? "Present" : item.endDate || "",
        points: text,
      }, token);
      setSuggestion({ source: text, points: points || [] });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Field label="Bullet points (one per line)">
        <textarea
          rows={5}
          className={inputCls}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setError("");
            onChange(e.target.value);
          }}
        />
      </Field>
      <p className="mt-1 text-xs text-neutral-400">Wrap words in **double stars** to make them bold.</p>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={improve}
          disabled={busy}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-neutral-100 hover:bg-white/10 disabled:opacity-60"
        >
          {busy ? "Improving…" : "Improve with AI"}
        </button>
        {error && <span className="text-xs text-red-300">{error}</span>}
      </div>

      {showSuggestion && (
        <div className="mt-3 rounded-xl border border-white/20 bg-white/5 p-4">
          <p className="text-sm font-medium text-neutral-100">AI suggestion</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-200">
            {suggestion.points.map((p, i) => (
              <li key={i}>
                <Rich text={p} />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onChange(suggestion.points.join("\n"));
                setSuggestion(null);
              }}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-neutral-200"
            >
              Use this
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="rounded-lg px-3 py-1.5 text-sm text-neutral-300 hover:text-white"
            >
              Keep mine
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            Check it before you use it. AI can reword things, so make sure every point is still true.
          </p>
        </div>
      )}
    </div>
  );
}

function EntryCard({ section, items, setItem, addItem, removeItem }) {
  const { key, title, add, fields, dates, pointsPlaceholder } = section;

  return (
    <Card title={title}>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map(([f, label, ph]) => (
                <Field key={f} label={label}>
                  <input
                    className={inputCls}
                    placeholder={ph}
                    value={item[f] || ""}
                    onChange={(e) => setItem(key, i, f, e.target.value)}
                  />
                </Field>
              ))}
            </div>

            {dates === "month" && (
              <div className="mt-3 grid items-end gap-3 sm:grid-cols-3">
                <Field label="Start">
                  <input type="month" className={inputCls} value={item.startDate || ""}
                    onChange={(e) => setItem(key, i, "startDate", e.target.value)} />
                </Field>
                <Field label="End">
                  <input type="month" disabled={item.current}
                    className={`${inputCls} disabled:opacity-40`} value={item.endDate || ""}
                    onChange={(e) => setItem(key, i, "endDate", e.target.value)} />
                </Field>
                <label className="flex items-center gap-2 pb-2 text-sm text-neutral-300">
                  <input type="checkbox" className="accent-white" checked={!!item.current}
                    onChange={(e) => setItem(key, i, "current", e.target.checked)} />
                  I work here now
                </label>
              </div>
            )}

            {dates === "year" && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Start year">
                  <input className={inputCls} placeholder="2023" maxLength={4} value={item.startYear || ""}
                    onChange={(e) => setItem(key, i, "startYear", e.target.value)} />
                </Field>
                <Field label="End year (or expected)">
                  <input className={inputCls} placeholder="2027" maxLength={4} value={item.endYear || ""}
                    onChange={(e) => setItem(key, i, "endYear", e.target.value)} />
                </Field>
              </div>
            )}

            {pointsPlaceholder && (
              <div className="mt-3">
                <PointsField
                  sectionKey={key}
                  item={item}
                  placeholder={pointsPlaceholder}
                  onChange={(v) => setItem(key, i, "pointsText", v)}
                />
              </div>
            )}

            <button type="button" onClick={() => removeItem(key, i)}
              className="mt-3 text-xs text-red-300/80 hover:text-red-300">
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => addItem(key)}
        className="mt-4 w-full rounded-lg border border-dashed border-white/20 py-2 text-sm text-neutral-300 hover:bg-white/10">
        + {add}
      </button>
    </Card>
  );
}

/* ---------- page ---------- */
export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState(initialForm);
  const [view, setView] = useState("edit"); // "edit" | "preview"
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  // Edit mode: fetch the saved resume and fill every section of the form
  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    getResumeById(id, token)
      .then((r) => !cancelled && setForm(fromBackend(r)))
      .catch((e) => !cancelled && setMessage({ type: "error", text: e.message }))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id, isNew]);

  /* updaters */
  const setTitle = (v) => setForm((s) => ({ ...s, title: v }));
  const setContact = (f, v) => setForm((s) => ({ ...s, contact: { ...s.contact, [f]: v } }));
  const setItem = (key, i, f, v) =>
    setForm((s) => ({ ...s, [key]: s[key].map((it, idx) => (idx === i ? { ...it, [f]: v } : it)) }));
  const addItem = (key) => setForm((s) => ({ ...s, [key]: [...s[key], BLANK[key]()] }));
  const removeItem = (key, i) =>
    setForm((s) => ({ ...s, [key]: s[key].filter((_, idx) => idx !== i) }));

  const resume = toBackend(form); // what the backend gets AND what the preview draws

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (isNew) {
        const saved = await createResume(resume, token);
        if (saved?._id) navigate(`/resume-builder/${saved._id}`, { replace: true });
      } else {
        await updateResume(id, resume, token);
        setMessage({ type: "success", text: "Saved" });
      }
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  // Prints a hidden copy of the resume (see print styles below), so the PDF has real text
  const handleDownload = () => {
    const old = document.title;
    document.title = `${form.contact.fullName || "My"} - Resume`;
    window.print();
    document.title = old;
  };

  if (loading) {
    return <div className="p-10 text-center text-neutral-400">Loading your resume…</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        #print-root { display: none; }
        @media print {
          body > *:not(#print-root) { display: none !important; }
          #print-root { display: block !important; }
          .rb-paper { font-size: 12.5px !important; padding: 0 !important; min-height: 0 !important; box-shadow: none !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>

      {/* top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/resume-builder" className="text-sm text-neutral-300 hover:text-white">
            ← My resumes
          </Link>

          <input
            value={form.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this resume (e.g. Frontend developer)"
            maxLength={80}
            className="min-w-[180px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm placeholder-white/30 focus:border-white/50 focus:outline-none"
          />

          {/* toggle */}
          <div className="flex rounded-lg border border-white/15 bg-white/5 p-0.5 text-sm">
            {[["edit", "Edit"], ["preview", "Preview"]].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-4 py-1 ${view === v ? "bg-white text-black" : "text-neutral-400 hover:text-white"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {message && (
            <span className={`text-sm ${message.type === "error" ? "text-red-300" : "text-emerald-300"}`}>
              {message.text}
            </span>
          )}

          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={handleDownload}
            className="rounded-lg border border-white/25 px-4 py-1.5 text-sm text-neutral-100 hover:bg-white/10">
            Download PDF
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {view === "edit" ? (
          <div className="mx-auto max-w-3xl space-y-5">
            <Card title="Contact">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["fullName", "Full name", "Aarav Patil"],
                  ["location", "Location", "Pune, Maharashtra, India"],
                  ["email", "Email", "you@email.com"],
                  ["phone", "Phone", "+91-9876543210"],
                  ["linkedin", "LinkedIn link", "linkedin.com/in/your-name"],
                  ["github", "GitHub link", "github.com/your-name"],
                  ["leetcode", "LeetCode link", "leetcode.com/your-name"],
                  ["portfolio", "Portfolio link (optional)", "your-site.com"],
                ].map(([f, label, ph]) => (
                  <Field key={f} label={label}>
                    <input className={inputCls} placeholder={ph} value={form.contact[f]}
                      onChange={(e) => setContact(f, e.target.value)} />
                  </Field>
                ))}
              </div>
            </Card>

            {SECTIONS.map((section) => (
              <EntryCard
                key={section.key}
                section={section}
                items={form[section.key]}
                setItem={setItem}
                addItem={addItem}
                removeItem={removeItem}
              />
            ))}

            <button onClick={() => setView("preview")}
              className="w-full rounded-xl bg-white py-3 text-sm font-medium text-black hover:bg-neutral-200">
              See how it looks
            </button>
          </div>
        ) : (
          <div className="mx-auto max-w-[794px]">
            <p className="mb-3 text-center text-xs text-neutral-400">
              This is how your PDF will look. The dashed line shows where page 2 starts.
            </p>
            <div className="shadow-2xl shadow-black/60">
              <ResumePreview resume={resume} />
            </div>
          </div>
        )}
      </div>

      {/* hidden print copy, lives directly under <body> so print CSS can show only this */}
      {createPortal(
        <div id="print-root">
          <ResumePreview resume={resume} compact />
        </div>,
        document.body
      )}
    </div>
  );
}
