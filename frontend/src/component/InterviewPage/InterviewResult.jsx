import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// import { getInterviewResult } 
import { getInterviewResult } from "../../services/operation/interview";
import { AuthContext } from "../../context/authContext";

const tone = (s) => (s >= 7 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : s >= 4 ? "text-amber-400 border-amber-500/40 bg-amber-500/10" : "text-red-400 border-red-500/40 bg-red-500/10");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function InterviewResult() {
    const { count } = useParams();
    const { state } = useLocation(); // right after the exam we get { result, seconds } here
    const { token } = useContext(AuthContext)
    const [result, setResult] = useState(state?.result || null);

    // opened from history (or refreshed): load from backend
    useEffect(() => {
        if (!result) getInterviewResult(Number(count), token).then(setResult);
    }, [result, count, token]);

    if (!result)
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-[#000814] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </main>
        );

    const done = result.results.filter((r) => !r.skipped);
    const sum = done.reduce((a, r) => a + r.score, 0);

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white relative px-4 py-10">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />
            <div className="relative w-11/12 max-w-3xl mx-auto">
                <Link to="/ai-interview/history" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">← All interviews</Link>

                <div className="text-center bg-[#0b1120] border border-slate-800 rounded-2xl p-8 mt-4 shadow-xl shadow-purple-900/20">
                    <p className="text-xs uppercase tracking-widest text-slate-500">{result.field} · Interview #{count} · {fmtDate(result.date)}</p>
                    <p className="text-5xl font-bold mt-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{sum} / {result.results.length * 10}</p>
                    <p className="text-sm text-slate-400 mt-2">
                        Answered {done.length} of {result.results.length}{state?.seconds != null && ` · Time ${fmtTime(state.seconds)}`}
                    </p>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                    {result.results.map((r, i) => (
                        <div key={i} className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-start justify-between gap-4">
                                <p className="font-medium"><span className="text-purple-400">Q{i + 1}.</span> {r.question}</p>
                                {!r.skipped && <span className={`shrink-0 px-3 py-1 rounded-lg border text-sm font-semibold ${tone(r.score)}`}>{r.score}/10</span>}
                            </div>
                            {r.skipped ? (
                                <p className="text-sm text-slate-500 mt-3">Skipped</p>
                            ) : (
                                <>
                                    <p className="text-sm text-slate-400 mt-3"><span className="text-slate-300">Your answer:</span> {r.answer}</p>
                                    <p className="text-sm text-slate-300 mt-3 p-3 rounded-lg bg-purple-600/10 border border-purple-500/20">
                                        {r.failed ? "AI could not evaluate this answer." : r.feedback}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <Link to="/ai-interview/history" className="px-6 py-3 rounded-xl text-sm text-slate-300 bg-[#111827] border border-slate-800 hover:bg-slate-800 transition-colors">View history</Link>
                    <Link to="/ai-interview" className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all">Start a new interview</Link>
                </div>
            </div>
        </main>
    );
}
