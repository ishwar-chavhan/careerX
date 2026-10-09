import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { sendotp } from "../services/operation/auth";
const inputClass = "w-full px-4 py-3 rounded-lg bg-[#111827] border border-slate-700 placeholder-slate-500 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition";

export default function Signup() {
  const { setSignUpData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function submitHandler(e) {
    e.preventDefault();
    setSignUpData(formData);
    console.log(formData);
    await sendotp(formData.email, navigate);
  }




  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative bg-[#000814] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="relative w-full max-w-md bg-[#0b1120] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-purple-900/20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">
            <span className="text-purple-500">✦</span> Create your account
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Build. Practice. Understand. Get placement-ready.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <div className="flex  gap-1.5">
            <div>
              <label htmlFor="firstName" className="text-sm ml-1 text-slate-300">First name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Ishwar"
                onChange={changeHandler}
                value={formData.firstName}
                className={inputClass} />
            </div>

            <div>
              <label htmlFor="lastName" className="text-sm ml-1 text-slate-300">last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Chavhan"
                onChange={changeHandler}
                value={formData.lastName}
                className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-slate-300">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={changeHandler}
              value={formData.email}
              className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm text-slate-300">Password</label>
              <input id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                onChange={changeHandler}
                value={formData.password}
                className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="text-sm text-slate-300">Confirm</label>
              <input
                id="confirm"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={changeHandler}
                value={formData.confirmPassword}
                className={inputClass} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
