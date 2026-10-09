import { useEffect, useRef, useState, useContext } from "react";
import { Settings, LogOut } from "lucide-react";
import AccountModal from "./Profile";
import { AuthContext } from "../../context/authContext";

// Placeholder - replace with your real user data (matches your User schema)
// const user = {
//   firstName: "Ishwar",
//   lastName: "Chavhan",
//   email: "ishwarchavhan30feb@gmail.com",
//   image: "", // image url; falls back to initial letter if empty
//   accountType: "User",
//   googleId: "123", // remove / undefined if not a Google login
//   additionalDetails: {
//     dateOfBirth: "",
//     gender: "",
//     contactNumber: "",
//     about: "",
//   },
// };


export function Avatar({ user, size = "w-10 h-10", text = "text-base" }) {
  return user.image ? (
    <img src={user.image} alt={user.firstName} className={`${size} rounded-full object-cover`} />
  ) : (
    <div className={`${size} ${text} rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center font-semibold text-white`}>
      {user.firstName[0]}
    </div>
  );
}


export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const ref = useRef(null);
  const {user} = useContext(AuthContext)

  const { logout } = useContext(AuthContext)
  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full ring-2 ring-transparent hover:ring-red-500/60 transition"
        >
          <Avatar user={user} />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-72 z-50 bg-[#0b1120] border border-slate-800 rounded-xl shadow-xl shadow-red-900/30 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-slate-800">
              <Avatar user={user} size="w-11 h-11" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => { setOpen(false); setShowAccount(true); }}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-sm text-slate-300 hover:bg-red-600/10 hover:text-red-300 transition-colors"
            >
              <Settings size={16} /> Manage account
            </button>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-sm text-slate-300 border-t border-slate-800 hover:bg-red-600/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}
      </div>

      {showAccount && <AccountModal user={user} onClose={() => setShowAccount(false)} />}
    </>
  );
}
