import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
// import { getAIsFeedback, getInterviewQuestions } from "./interviewAPI";
import { getAIsFeedback, getInterviewQuestions } from "../../services/operation/interview";
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function InterviewExam() {
    const { count } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [interview, setInterview] = useState(state?.data || null);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [seconds, setSeconds] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(0); // how many evaluated so far

    // reload questions after a page refresh
    useEffect(() => {
        if (!interview) getInterviewQuestions(Number(count), token).then(setInterview);
    }, [interview, count, token]);

    useEffect(() => {
        if (interview && !answers.length) setAnswers(Array(interview.questions.length).fill(""));
    }, [interview, answers.length]);

    // exam timer
    useEffect(() => {
        if (!interview) return;
        const id = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [interview]);

    if (!interview)
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-[#000814] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </main>
        );

    const { questions, field } = interview;
    const total = questions.length;
    const solved = answers.filter((a) => a.trim()).length;
    const setAnswer = (v) => setAnswers((prev) => prev.map((a, i) => (i === current ? v : a)));

    const handleSubmit = async () => {
        if (solved < total && !window.confirm(`You answered ${solved} of ${total}. Submit anyway?`)) return;
        setSubmitting(true);
        const out = [];
        for (let i = 0; i < total; i++) {
            if (!answers[i].trim()) { out.push({ question: questions[i], skipped: true }); continue; }
            const fb = await getAIsFeedback(Number(count), questions[i], answers[i], token);
            out.push({ question: questions[i], answer: answers[i], feedback: fb?.feedback, score: fb?.score ?? 0, failed: !fb });
            setDone(i + 1);
        }
        setSubmitting(false);
        // show the result page immediately
        navigate(`/ai-interview/result/${count}`, {
            replace: true,
            state: { seconds, result: { count, field, date: new Date().toISOString(), results: out } },
        });
    };

    /* ---------------- EXAM VIEW ---------------- */
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#000814] text-white relative px-4 py-8">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12),transparent_55%)]" />
            <div className="relative w-11/12 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

                {/* LEFT: question + answer */}
                <section className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-purple-900/10 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest">
                        <span>{field}</span>
                        <span>Question {current + 1} of {total}</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-semibold mt-5 leading-snug">
                        <span className="text-purple-500">Q{current + 1}.</span> {questions[current]}
                    </h2>

                    <textarea
                        value={answers[current] || ""}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        disabled={submitting}
                        className="mt-6 w-full min-h-[280px] flex-1 px-4 py-3 rounded-lg bg-[#111827] border border-slate-700 placeholder-slate-500 text-sm outline-none resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
                    />
                    <p className="text-xs text-slate-500 mt-2 text-right">{(answers[current] || "").length} characters</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrent((c) => c - 1)}
                                disabled={current === 0 || submitting}
                                className="px-5 py-2.5 rounded-lg text-sm text-slate-300 bg-[#111827] border border-slate-800 hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setCurrent((c) => c + 1)}
                                disabled={current === total - 1 || submitting}
                                className="px-5 py-2.5 rounded-lg text-sm text-purple-300 bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Save & Next →
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting || solved === 0}
                            className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
                        >
                            {submitting ? `Evaluating ${done}/${solved}...` : "Submit Interview"}
                        </button>
                    </div>
                </section>

                {/* RIGHT: progress details */}
                <aside className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 h-fit lg:sticky lg:top-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Progress</h3>
                        <span className="text-sm font-mono text-purple-300 px-2.5 py-1 rounded-lg bg-purple-600/10 border border-purple-500/30">⏱ {fmt(seconds)}</span>
                    </div>

                    <p className="text-3xl font-bold mt-5">{solved}<span className="text-lg text-slate-500"> / {total}</span></p>
                    <p className="text-xs text-slate-500">questions solved</p>
                    <div className="h-2 rounded-full bg-slate-800 mt-3">
                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all" style={{ width: `${(solved / total) * 100}%` }} />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {questions.map((_, i) => {
                            const answered = answers[i]?.trim();
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    disabled={submitting}
                                    className={`h-12 rounded-lg text-sm font-semibold border transition-all ${i === current
                                        ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-400 text-white shadow-lg shadow-purple-900/40"
                                        : answered
                                            ? "bg-purple-600/20 border-purple-500/50 text-purple-200"
                                            : "bg-[#111827] border-slate-700 text-slate-400 hover:border-purple-500/50"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex flex-col gap-2 text-xs text-slate-400">
                        <p className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gradient-to-br from-purple-600 to-indigo-600" /> Current</p>
                        <p className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-600/30 border border-purple-500/50" /> Answered</p>
                        <p className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#111827] border border-slate-700" /> Not answered</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
