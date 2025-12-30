// Signup.jsx
import React, { useState } from "react";
import { UserPlus, Mail, Lock } from "lucide-react";
import axios from "axios";
import { Link } from 'react-router-dom';
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: import.meta.env.VITE_BASE_PATH || "" });

export default function Signup({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const navigate = useNavigate();
  

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Full name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Enter a valid email";
    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6) err.password = "Password must be 6+ chars";
    if (form.password !== form.confirm) err.confirm = "Passwords do not match";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSignup = async (ev) => {
    ev?.preventDefault();
    if (!validate()) return;
    setServerMsg("");
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setServerMsg("Account created. Redirecting...");
      onSuccess?.(res.data);
      navigate("/", { replace: true });
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-50">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create an account</h2>
            <p className="text-sm text-gray-500">Sign up to manage clinic appointments & records</p>
          </div>
        </div>

        {serverMsg && <div className="mb-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">{serverMsg}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-600">Full name</span>
            <div className={clsx("mt-1 rounded-lg border px-3 py-2 flex items-center", errors.name ? "border-red-300 bg-red-50" : "border-gray-200")}>
              <input value={form.name} onChange={(err) => { setForm({ ...form, name: err.target.value }); if (errors.name) setErrors(prev => ({...prev, name: "" })); }} placeholder="Jane Doe" className="flex-1 text-sm outline-none" />
            </div>
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Email</span>
            <div className={clsx("mt-1 rounded-lg border px-3 py-2 flex items-center", errors.email ? "border-red-300 bg-red-50" : "border-gray-200")}>
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input value={form.email} onChange={(err) => { setForm({ ...form, email: err.target.value }); if (errors.email) setErrors(prev => ({...prev, email: "" })); }} placeholder="you@clinic.com" className="flex-1 text-sm outline-none" />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-gray-600">Password</span>
              <div className={clsx("mt-1 rounded-lg border px-3 py-2", errors.password ? "border-red-300 bg-red-50" : "border-gray-200")}>
                <Lock className="h-4 w-4 text-gray-400 inline-block mr-2" />
                <input type="password" value={form.password} onChange={(err) => { setForm({ ...form, password: err.target.value }); if (errors.password) setErrors(prev => ({...prev, password: "" })); }} placeholder="Password" className="w-full text-sm outline-none" />
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Confirm</span>
              <div className={clsx("mt-1 rounded-lg border px-3 py-2", errors.confirm ? "border-red-300 bg-red-50" : "border-gray-200")}>
                <input type="password" value={form.confirm} onChange={(err) => { setForm({ ...form, confirm: err.target.value }); if (errors.confirm) setErrors(prev => ({...prev, confirm: "" })); }} placeholder="Confirm password" className="w-full text-sm outline-none" />
              </div>
              {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>}
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Already registered? <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
