import { useEffect, useState , useContext } from "react";
import { Link } from "react-router-dom";
// import { getInterviewHistory } from "./interviewAPI";
import { AuthContext } from "../../context/authContext";
import { getInterviewHistory } from "../../services/operation/interview";

const tone = (s) => (s >= 7 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : s >= 4 ? "text-amber-400 border-amber-500/40 bg-amber-500/10" : "text-red-400 border-red-500/40 bg-red-500/10");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function InterviewHistory() {
    const { token } = useContext(AuthContext)
    const [history, setHistory] = useState(null);

    useEffect(() => {
        getInterviewHistory(token).then(setHistory);
    }, [token]);

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white relative px-4 py-10">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />
            <div className="relative w-11/12 max-w-3xl mx-auto">
                <Link to="/ai-interview" className="text-sm text-slate-400 hover:text-purple-400 transition-colors">← Back</Link>
                <h1 className="text-3xl font-bold mt-4"><span className="text-purple-500">✦</span> Interview History</h1>
                <p className="text-sm text-slate-500 mt-2">Only your latest 7 interviews are saved. Click one to see its result.</p>

                <div className="flex flex-col gap-3 mt-8">
                    {history === null && <div className="mx-auto w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />}

                    {history?.length === 0 && (
                        <div className="text-center bg-[#0b1120] border border-slate-800 rounded-2xl p-10">
                            <p className="text-slate-400">No interviews yet.</p>
                            <Link to="/interview" className="inline-block mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600">Start your first interview</Link>
                        </div>
                    )}

                    {history?.map((h) => {
                        const avg = h.answered ? h.totalScore / h.answered : 0;
                        return (
                            <Link
                                key={h.count}
                                to={`/ai-interview/result/${h.count}`}
                                className="group flex items-center justify-between gap-4 bg-[#0b1120] border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-200"
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">
                                        <span className="text-purple-400">#{h.count}</span> {h.field}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{fmtDate(h.date)} · Answered {h.answered} of {h.totalQuestions}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`px-3 py-1 rounded-lg border text-sm font-semibold ${tone(avg)}`}>{h.totalScore}/{h.answered * 10}</span>
                                    <span className="text-slate-600 group-hover:text-purple-400 transition-colors">→</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
