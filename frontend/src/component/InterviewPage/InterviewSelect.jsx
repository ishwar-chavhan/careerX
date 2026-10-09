import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { generateInterviewQuestions, getInterviewHistory } 
import { generateInterviewQuestions, getInterviewHistory } from "../../services/operation/interview";

const MAX = 7;
const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Analyst", "AI / ML Engineer", "DevOps Engineer", "Android Developer",
    "Cybersecurity Analyst"];
const pct = (h) => (h.answered ? Math.round((h.totalScore / (h.answered * 10)) * 100) : 0);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function Box({ label, children }) {
    return (
        <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl shadow-purple-900/10 flex flex-col">
            <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
            {children}
        </div>
    );
}

export default function InterviewSelect() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [history, setHistory] = useState([]); // newest first
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [role, setRole] = useState("");
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        getInterviewHistory(token).then((h) => { setHistory(h); setLoadingHistory(false); });
    }, [token]);

    const latest = history[0];
    const totalAnswered = history.reduce((s, h) => s + h.answered, 0);
    const avg = totalAnswered ? (history.reduce((s, h) => s + h.totalScore, 0) / totalAnswered).toFixed(1) : "-";
    const best = history.length ? Math.max(...history.map((h) => (h.answered ? h.totalScore / h.answered : 0))).toFixed(1) : "-";
    const chartData = [...history].reverse().map((h) => ({ name: `#${h.count}`, score: pct(h) }));

    const handleStart = async () => {
        if (!role) return;
        setStarting(true);
        const count = (latest?.count || 0) + 1; // next interview number
        const data = await generateInterviewQuestions(role, count, token);
        setStarting(false);
        if (data) navigate(`/ai-interview/${count}`, { state: { data } });
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white relative px-4 py-12">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

            <div className="relative w-11/12 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold"><span className="text-purple-500">✦</span> AI MOCK INTERVIEW</h1>
                    <p className="text-slate-400 mt-3">Track your progress and practice 9 technical questions with AI feedback.</p>
                </div>

                {/* 3 boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Box label="Interviews taken">
                        <p className="text-4xl font-bold mt-3">{loadingHistory ? "-" : history.length}<span className="text-lg text-slate-500"> / {MAX}</span></p>
                        <div className="h-2 rounded-full bg-slate-800 mt-4">
                            <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all" style={{ width: `${(history.length / MAX) * 100}%` }} />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Your latest {MAX} interviews are saved</p>
                    </Box>

                    <Box label="Average score">
                        <p className="text-4xl font-bold mt-3">{avg}<span className="text-lg text-slate-500"> / 10</span></p>
                        <p className="text-xs text-slate-500 mt-auto pt-4">Best interview: <span className="text-purple-300">{best}/10</span></p>
                    </Box>

                    <Box label="Latest interview">
                        {latest ? (
                            <>
                                <p className="font-semibold mt-3 truncate">{latest.field}</p>
                                <p className="text-xs text-slate-500 mt-1">#{latest.count} · {fmtDate(latest.date)} · <span className="text-purple-300">{latest.totalScore}/{latest.answered * 10}</span></p>
                            </>
                        ) : (
                            <p className="text-sm text-slate-500 mt-3">No interviews yet</p>
                        )}
                        <Link to="/ai-interview/history" className="mt-auto pt-4 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                            View history →
                        </Link>
                    </Box>
                </div>

                {/* Progress graph */}
                <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 mt-6 shadow-xl shadow-purple-900/10">
                    <h3 className="text-lg font-semibold">Your progress</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Score percentage of each interview</p>
                    {chartData.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={chartData} margin={{ left: -10, right: 10 }}>
                                <defs>
                                    <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                <Tooltip contentStyle={{ background: "#0b1120", border: "1px solid #1e293b", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={(v) => [`${v}%`, "Score"]} />
                                <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2.5} fill="url(#purpleFill)" dot={{ r: 4, fill: "#a855f7" }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-slate-500 py-16 text-center">Take your first interview to see your progress here.</p>
                    )}
                </div>

                {/* Select + start */}
                <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 mt-6 shadow-xl shadow-purple-900/10">
                    <h3 className="text-lg font-semibold mb-4">Start a new interview</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg bg-[#111827] border border-slate-700 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition [color-scheme:dark]"
                        >
                            <option value="">Select a role</option>
                            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button
                            onClick={handleStart}
                            disabled={!role || starting}
                            className="px-8 py-3 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
                        >
                            {starting ? "Generating..." : "🎤 Start interview"}
                        </button>
                    </div>
                    {history.length >= MAX && (
                        <p className="text-xs text-slate-500 mt-3">You have {MAX} saved interviews. Starting a new one will remove your oldest.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
