import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { fetchIndustryInsight } from "./industryApi";
import { AuthContext } from "../../context/authContext";
import { fetchIndustryInsight } from "../../services/operation/Industry";
const industries = [
  { name: "Software Development", icon: "💻" },
  { name: "Cybersecurity", icon: "🛡️" },
  { name: "Data Science & AI", icon: "🤖" },
  { name: "Cloud & DevOps", icon: "☁️" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Finance & Banking", icon: "🏦" },
  { name: "E-commerce", icon: "🛒" },
  { name: "EdTech", icon: "🎓" },
  { name: "Game Development", icon: "🎮" },
  { name: "Telecommunications", icon: "📡" },
  { name: "Manufacturing", icon: "🏭" },
  { name: "Digital Marketing", icon: "📣" },
];

export default function IndustrySelect() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const industry = (custom.trim() || selected).trim();

  const handleGenerate = async () => {
    if (!industry) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchIndustryInsight(industry, token);
      if (!data) throw new Error("No data returned from server");
      navigate(`/industrial-trends/${encodeURIComponent(industry)}`, { state: { data } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white relative px-4 py-14">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.15),transparent_60%)]" />

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-red-500">✦</span> INDUSTRY INSIGHTS
          </h1>
          <p className="text-slate-400 mt-3">
            Pick an industry and get AI-powered job market, trending tech and skill insights.
          </p>
        </div>

        {/* Industry cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {industries.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => { setSelected(name); setCustom(""); }}
              className={`p-4 rounded-xl border text-sm font-medium flex flex-col items-center gap-2 transition-all duration-200 ${selected === name && !custom.trim()
                ? "bg-red-600/20 border-red-500 text-red-200 shadow-lg shadow-red-900/30"
                : "bg-[#0b1120] border-slate-800 text-slate-300 hover:border-red-500/50 hover:-translate-y-0.5"
                }`}
            >
              <span className="text-2xl">{icon}</span>
              {name}
            </button>
          ))}
        </div>

        {/* Custom industry */}
        <div className="mt-8 max-w-md mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500 mb-3">
            or type your own
          </p>
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. Aerospace, Fintech, Biotechnology"
            className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-slate-700 placeholder-slate-500 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition"
          />
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg py-3 max-w-md mx-auto">
            {error}
          </p>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleGenerate}
            disabled={!industry || loading}
            className="px-10 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing market..." : `✨ Generate insights${industry ? ` for ${industry}` : ""}`}
          </button>
          {loading && (
            <p className="text-xs text-slate-500 mt-3">
              First time for an industry can take 10-20 seconds. Next time it loads instantly.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
