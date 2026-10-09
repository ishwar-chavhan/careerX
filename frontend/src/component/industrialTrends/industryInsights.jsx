import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell,
} from "recharts";
import { fetchIndustryInsight } from "../../services/operation/Industry";

const RED = "#ef4444";
const COLORS = ["#ef4444", "#f43f5e", "#fb7185", "#f97316", "#fca5a5", "#e11d48"];
const toLPA = (n) => +(n / 100000).toFixed(1); // annual INR -> lakhs per annum

const tooltipProps = {
  contentStyle: { background: "#0b1120", border: "1px solid #1e293b", borderRadius: 8, color: "#fff", fontSize: 12 },
  cursor: { fill: "rgba(239,68,68,0.08)" },
};
const axisTick = { fill: "#94a3b8", fontSize: 12 };

function Card({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-red-900/10 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-1 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold mt-14 mb-5">
      <span className="text-red-500">✦</span> {children}
    </h2>
  );
}

function Stat({ label, value, tone = "text-white" }) {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${tone}`}>{value}</p>
    </div>
  );
}

export default function IndustryInsights() {
  const { industry } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState(state?.data || null);
  const [error, setError] = useState("");
  const [role, setRole] = useState(0);

  // If the user refreshes the page, fetch again (backend returns cached data, so it's fast)
  useEffect(() => {
    console.log(data);
    if (data) return;
    fetchIndustryInsight(decodeURIComponent(industry)).then(setData).catch((e) => setError(e.message));
  }, [data, industry]);

  if (error)
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <Link to="/industrial-trends" className="text-sm text-slate-400 hover:text-red-400">← Choose another industry</Link>
      </main>
    );

  if (!data)
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Analyzing {decodeURIComponent(industry)} market...</p>
      </main>
    );

  const { marketOverview: m, jobMarket, trendingTechnologies, roleBasedRequiredSkills } = data;
  const positive = m.outlook === "Positive";
  const demandTone = { High: "text-red-400", Medium: "text-orange-400", Low: "text-slate-300" }[m.demandLevel];
  const salaryData = jobMarket.map((j) => ({
    role: j.role,
    range: [toLPA(j.salary.minimum), toLPA(j.salary.maximum)],
  }));
  const activeRole = roleBasedRequiredSkills[role] || roleBasedRequiredSkills[0];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white relative px-4 py-10">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.12),transparent_55%)]" />

      <div className="relative w-11/12 max-w-[1200px] mx-auto">
        {/* Header */}
        <Link to="/industrial-trends" className="text-sm text-slate-400 hover:text-red-400 transition-colors">
          ← Change industry
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3 mt-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            {data.industry} <span className="text-red-500">Insights</span>
          </h1>
          {data.expiresAt && (
            <p className="text-xs text-slate-500">
              Next refresh: {new Date(data.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          )}
        </div>

        {/* Market overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Stat label="Market outlook" value={`${positive ? "▲" : "▼"} ${m.outlook}`} tone={positive ? "text-emerald-400" : "text-red-400"} />
          <Stat label="Growth" value={`${m.growthPercentage}%`} />
          <Stat label="Demand level" value={m.demandLevel} tone={demandTone} />
        </div>

        {/* 1. Job market */}
        <SectionTitle>Job Market</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Demand by role" subtitle="Hiring demand score (0-100)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobMarket} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={axisTick} />
                <YAxis type="category" dataKey="role" width={140} tick={axisTick} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="demand" radius={[0, 6, 6, 0]}>
                  {jobMarket.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Salary range" subtitle="Annual salary in LPA (min to max)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tick={axisTick} unit=" L" />
                <YAxis type="category" dataKey="role" width={140} tick={axisTick} />
                <Tooltip {...tooltipProps} formatter={(v) => [`₹${v[0]}L - ₹${v[1]}L`, "Salary"]} />
                <Bar dataKey="range" fill={RED} radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 2. Trending technologies */}
        <SectionTitle>Trending Technologies</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Technology demand" subtitle="How in-demand each technology is (0-100)">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={trendingTechnologies} outerRadius="75%">
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="technology" tick={axisTick} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="demand" stroke={RED} fill={RED} fillOpacity={0.35} />
                <Tooltip {...tooltipProps} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Top technologies ranked" subtitle="Learn these first">
            <div className="flex flex-col gap-4 mt-2">
              {[...trendingTechnologies].sort((a, b) => b.demand - a.demand).map((t, i) => (
                <div key={t.technology}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-200">{i + 1}. {t.technology}</span>
                    <span className="text-red-400 font-medium">{t.demand}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-red-600 to-rose-500" style={{ width: `${t.demand}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 3. Role based skills */}
        <SectionTitle>Required Skills by Role</SectionTitle>
        <Card title={activeRole.role} subtitle="Skill importance for this role (0-100). Pick a role below.">
          <div className="flex flex-wrap gap-2 mb-6">
            {roleBasedRequiredSkills.map((r, i) => (
              <button
                key={r.role}
                onClick={() => setRole(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === role ? "bg-red-600/20 text-red-300 border border-red-500/40" : "bg-[#111827] text-slate-400 border border-slate-800 hover:text-white"
                  }`}
              >
                {r.role}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={Math.max(220, activeRole.skills.length * 48)}>
            <BarChart data={activeRole.skills} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid stroke="#1e293b" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={axisTick} />
              <YAxis type="category" dataKey="name" width={150} tick={axisTick} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {activeRole.skills.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </main>
  );
}
