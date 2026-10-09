import { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { signUp } from "../services/operation/auth";
import toast from "react-hot-toast";
const OTP_LENGTH = 6;

export default function OtpVerify() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const navigate = useNavigate();
  const inputs = useRef([]);
  const { setSignUpData, signUpData } = useContext(AuthContext);

  const handleChange = (e, i) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only
    const next = [...otp];
    next[i] = value.slice(-1);
    setOtp(next);
    if (value && i < OTP_LENGTH - 1) inputs.current[i + 1].focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1].focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    console.log(signUpData);
    await signUp(
      signUpData.firstName,
      signUpData.lastName,
      signUpData.email,
      signUpData.password,
      signUpData.confirmPassword,
      code,
      navigate
    )
    console.log(code);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 relative bg-[#000814] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="relative w-full max-w-md bg-[#0b1120] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-purple-900/20 text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-2xl text-purple-400">
          ✉
        </div>
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-sm text-slate-400 mt-2">
          We sent a 6-digit code to
          <br />
          <span className="text-slate-200">{signUpData.email || "your email"}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold rounded-lg bg-[#111827] border border-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200"
          >
            Verify
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-6">
          Didn't get the code?{" "}
          <button type="button" className="text-purple-400 hover:text-purple-300 font-medium">
            Resend
          </button>
          <span className="text-slate-500"> in 30s</span>
        </p>
        <Link to="/signup" className="inline-block mt-4 text-xs text-slate-500 hover:text-slate-300">
          ← Back to signup
        </Link>
      </div>
    </main>
  );
}
