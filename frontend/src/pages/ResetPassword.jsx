import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ResetPasswordNow } from "../services/operation/auth";
const inputClass =
  "w-full px-4 py-3 rounded-lg bg-[#111827] border border-slate-700 placeholder-slate-500 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await ResetPasswordNow({ ...formData, token });
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Could not reset password");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative bg-[#000814] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="relative w-full max-w-md bg-[#0b1120] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-purple-900/20">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-2xl text-purple-400">
            🔒
          </div>
          <h1 className="text-2xl font-semibold">Set new password</h1>
          <p className="text-sm text-slate-400 mt-2">
            Your new password must be different from your previous one.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-slate-300">Password</label>
            <input id="password" type="password"
              placeholder="••••••••"
              name="password"
              onChange={changeHandler}
              className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm text-slate-300">Confirm Password</label>
            <input id="confirm"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              onChange={changeHandler}
              className={inputClass} />
          </div>

          <p className="text-xs text-slate-500 -mt-2">
            Use at least 8 characters with letters and numbers.
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600
             hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="inline-block mt-6 text-sm text-slate-400 hover:text-purple-400 transition-colors">
            ← Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
