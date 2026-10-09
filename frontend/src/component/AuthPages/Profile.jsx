import { useContext, useRef, useState } from "react";
import { User, ShieldCheck, X, Camera } from "lucide-react";
import { updateAdditionalDetails, updateProfilePicture } from "../../services/operation/profile";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";
import { changePassword } from "../../services/operation/auth";
const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-[#111827] border border-slate-700 placeholder-slate-500 text-sm text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition";

const badgeClass =
  "text-xs px-2 py-0.5 rounded-md bg-red-600/20 text-red-300 border border-red-500/30";

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3 py-5 
    border-b border-slate-800 last:border-0">
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="text-sm text-slate-300">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-300">{label}</label>
      {children}
    </div>
  );
}

const Empty = () => <span className="text-slate-500">Not added</span>;

function AvatarUpload({ user }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);   // object URL for preview
  const [fileObj, setFileObj] = useState(null);   // raw File to upload
  const [removed, setRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { token, setUser } = useContext(AuthContext);

  const src = removed ? "" : preview || user.image;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFileObj(file);
    setRemoved(false);
  };

  const cancel = () => {
    setPreview(null);
    setFileObj(null);
    setRemoved(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const savePhoto = async () => {
    if (!fileObj) return;
    setSaving(true);
    const updated = await updateProfilePicture(
      fileObj,
      user.firstName,
      user.lastName,
      token,
      setUser
    );
    setSaving(false);
    if (updated) {
      // revoke the temporary blob URL and clear local state
      URL.revokeObjectURL(preview);
      setPreview(null);
      setFileObj(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const changed = preview || removed;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {src ? (
          <img src={src} alt="" className="w-16 h-16 rounded-full object-cover 
          border-2 border-red-500/40" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-rose-600 
          flex items-center justify-center text-xl font-semibold text-white">
            {user.firstName[0]}
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-600
           hover:bg-red-500 border-2 border-[#0b1120] flex items-center justify-center
            text-white transition-colors"
          title="Change photo"
        >
          <Camera size={13} />
        </button>
        <input ref={fileRef} type="file"
          accept="image/*"
          onChange={handleFile} className="hidden" />
      </div>

      <div className="flex flex-col gap-1.5 items-start">
        {changed ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={savePhoto}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold
               text-white bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-lg
                hover:shadow-red-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save photo"}
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-[#111827]
               hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              Change profile picture
            </button>
            {user.image && (
              <button
                type="button"
                onClick={() => setRemoved(true)}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                Remove photo
              </button>
            )}
          </>
        )}
        <p className="text-xs text-slate-500">JPG, PNG or WEBP.</p>
      </div>
    </div>
  );
}

function PasswordSection({ user }) {
  const [open, setOpen] = useState(false);
  const hasPassword = !user.googleId; // Google users may not have a password yet
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    const changed = await changePassword(formData, token);
    if (!changed) {
      toast.error("something went wrong");
    }
  };
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-red-400 hover:text-red-300 font-medium transition-colors"
      >
        {hasPassword ? "Change password" : "Set password"}
      </button>
    );
  }

  return (
    <form className="flex flex-col gap-4 max-w-sm" onSubmit={submitHandler}>
      {hasPassword && (
        <Field label="Current password">
          <input
            type="password"
            placeholder="••••••••"
            className={inputClass}
            // value={formData.oldPassword}
            name="oldPassword"
            onChange={changeHandler}
          />
        </Field>
      )}
      <Field label="New password">
        <input
          type="password"
          placeholder="••••••••"
          className={inputClass}
          // value={formData.gender}
          name="newPassword"
          onChange={changeHandler}
        />
      </Field>
      <Field label="Confirm new password">
        <input type="password"
          placeholder="••••••••"
          className={inputClass}
          // value={formData.gender}
          name="confirmNewPassword"
          onChange={changeHandler}

        />
      </Field>
      <p className="text-xs text-slate-500 -mt-1">Use at least 8 characters with letters and numbers.</p>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r
           from-red-600 to-rose-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 
           transition-all duration-200"
        >
          Update password
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2.5 rounded-lg text-sm text-slate-300 
          bg-[#111827] hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        {hasPassword && (
          <a href="/forgot-password" className="text-xs text-slate-500 hover:text-red-400 transition-colors">
            Forgot password?
          </a>
        )}
      </div>
    </form>
  );
}

function ProfileTab({ user }) {
  const [formData, setFormData] = useState({
    contactNumber: 0,
    dateOfBirth: "",
    gender: "",
    about: ""

  })
  const [editing, setEditing] = useState(false);
  const d = user.additionalDetails || {};
  const fullName = `${user.firstName} ${user.lastName}`;
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { token, setUser } = useContext(AuthContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await updateAdditionalDetails(formData, token, setUser);
    if (!response) {
      toast.error("something went wrong");
    }
    console.log("response--------->", response)
  };


  return (
    <>
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <h2 className="text-lg font-semibold">Profile details</h2>
      </div>

      {/* Avatar + name */}
      <Row label="Profile">
        <div className="flex flex-col gap-5">
          <AvatarUpload user={user} />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-white">{fullName}</p>
              <span className={badgeClass}>{user.accountType}</span>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-600/10
                 hover:text-red-300 font-medium transition-colors"
              >
                Update profile
              </button>
            )}
          </div>
        </div>
      </Row>

      {editing ? (
        /* ---------- EDIT MODE ---------- */
        <form className="py-5 flex flex-col gap-5" onSubmit={submitHandler}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First name">
              <input type="text" defaultValue={user.firstName} readOnly className={inputClass} />
            </Field>
            <Field label="Last name">
              <input type="text" defaultValue={user.lastName} readOnly className={inputClass} />
            </Field>
            <Field label="Date of birth">
              <input type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                defaultValue={d.dateOfBirth}
                onChange={changeHandler}
                className={`${inputClass} [color-scheme:dark]`}

              />
            </Field>
            <Field label="Gender">
              <select defaultValue={d.gender || ""}
                className={inputClass}
                value={formData.gender}
                name="gender"
                onChange={changeHandler}
              >
                <option value="" disabled>Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </Field>
          </div>

          <Field label="Contact number">
            <input type="tel"
              value={formData.contactNumber}
              name="contactNumber"
              placeholder="+91 98765 43210"
              defaultValue={d.contactNumber}
              onChange={changeHandler}
              className={inputClass}

            />
          </Field>

          <Field label="About">
            <textarea
              onChange={changeHandler}
              name="about"
              value={formData.about}
              rows={4}
              placeholder="Tell us a little about yourself..."
              defaultValue={d.about}
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-5 py-2.5 rounded-lg text-sm text-slate-300 bg-[#111827]
               hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r
               from-red-600 to-rose-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 
               transition-all duration-200"
            >
              Save changes
            </button>
          </div>
        </form>
      ) : (
        /* ---------- VIEW MODE ---------- */
        <>
          <Row label="Email address">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white break-all">{user.email}</span>
              <span className={badgeClass}>Primary</span>
            </div>
          </Row>
          <Row label="Date of birth">{d.dateOfBirth || <Empty />}</Row>
          <Row label="Gender">{d.gender || <Empty />}</Row>
          <Row label="Contact number">{d.contactNumber || <Empty />}</Row>
          <Row label="About">
            <p className="leading-relaxed">{d.about || <Empty />}</p>
          </Row>

          {user.googleId && (
            <Row label="Connected accounts">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-lg leading-none">G</span>
                <span className="text-white">Google</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 break-all">{user.email}</span>
              </div>
            </Row>
          )}
        </>
      )}
    </>
  );
}

function SecurityTab({ user }) {
  return (
    <>
      <h2 className="text-lg font-semibold pb-5 border-b border-slate-800">Security</h2>

      <Row label="Password">
        <PasswordSection user={user} />
      </Row>

      <Row label="Delete account">
        <div className="flex flex-col gap-3 items-start">
          <p className="text-slate-400">
            This will permanently remove your account, resumes and interview feedback.
          </p>
          <button className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-600/10 hover:text-red-300 font-medium transition-colors">
            Delete account
          </button>
        </div>
      </Row>
    </>
  );
}

export default function AccountModal({ user, onClose }) {
  const [tab, setTab] = useState("profile");

  const tabClass = (name) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === name
      ? "bg-red-600/20 text-red-300"
      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
    }`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[640px] max-h-[90vh] flex flex-col md:flex-row
         bg-[#0b1120] border border-slate-800 rounded-2xl shadow-2xl shadow-red-900/30 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <aside className="md:w-64 shrink-0 p-6 bg-gradient-to-b from-[#111827] to-[#0b1120] 
        border-b md:border-b-0 md:border-r border-slate-800">
          <h1 className="text-2xl font-semibold">Account</h1>
          <p className="text-sm text-slate-400 mt-1 mb-6">Manage your account info.</p>
          <nav className="flex md:flex-col gap-1">
            <button onClick={() => setTab("profile")} className={tabClass("profile")}>
              <User size={16} /> Profile
            </button>
            <button onClick={() => setTab("security")} className={tabClass("security")}>
              <ShieldCheck size={16} /> Security
            </button>
          </nav>
        </aside>

        <section className="flex-1 p-6 md:p-8 overflow-y-auto">
          {tab === "profile" ? <ProfileTab user={user} /> : <SecurityTab user={user} />}
        </section>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800
           hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
