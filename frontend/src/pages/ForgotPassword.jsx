import { Link } from "react-router-dom";
import { resetToken } from "../services/operation/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
// import { AuthContext } from "../context/authContext";
const inputClass =
  "w-full px-4 py-3 rounded-lg bg-[#111827] border border-slate-700 placeholder-slate-500 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition";

export default function ForgotPassword() {
   const [formData, setFormData] = useState({
    email : ""
  });
  const {token} = useContext(AuthContext)
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
   const changed = await resetToken(formData , token);
  if(!changed){
    toast.error("something went wrong");
  }
  };


  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative bg-[#000814] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="relative w-full max-w-md bg-[#0b1120] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-purple-900/20 text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-2xl text-purple-400">
          🔑
        </div>
        <h1 className="text-2xl font-semibold">Forgot password?</h1>
        <p className="text-sm text-slate-400 mt-2">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form className="mt-8 flex flex-col gap-5 text-left" onSubmit={submitHandler}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email"
             className="text-sm
              text-slate-300"
              
              >Email</label>
            <input id="email" type="email" 
                     name="email"
                      onChange={changeHandler}
            placeholder="you@example.com" className={inputClass} />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200"
          >
            Send Reset Link
          </button>
        </form>

        <Link to="/login" className="inline-block mt-6 text-sm text-slate-400 hover:text-purple-400 transition-colors">
          ← Back to login
        </Link>
      </div>
    </main>
  );
}
