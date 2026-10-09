import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { login } from "../services/operation/auth";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-[#111827] border border-slate-700 placeholder-slate-500 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition";

export default function Login() {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password, navigate, setUser, setToken);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative bg-[#000814] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="relative w-full max-w-md bg-[#0b1120] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-purple-900/20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">
            <span className="text-purple-500">✦</span> Welcome back
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Log in to continue your career journey
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-slate-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={changeHandler}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-sm">
              <label htmlFor="password" className="text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={changeHandler}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
