// CreateUser.jsx
import React, { useState } from "react";
import { UserPlus, Mail, Lock , User , Loader2 , ArrowRight} from "lucide-react";
import axios from "axios";
import { Link } from 'react-router-dom';
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';
import { InputField } from "../components/inputFields";
const api = axios.create({ baseURL: import.meta.env.VITE_BASE_PATH || "" });

export default function CreateUser({ onSuccess }) {
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

  const handleCreateUser = async (ev) => {
    ev?.preventDefault();
    if (!validate()) return;
    setServerMsg("");
    try {
      setLoading(true);
      const res = await api.post("/public/createUser", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setServerMsg("Account created. Redirecting...");
      onSuccess?.(res.data);
      navigate("/", { replace: true });
    } catch (err) {
      setServerMsg(err.response?.data?.message || "CreateUser failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
            <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">Create an account</h1>
            <p className="text-[15px] font-medium text-slate-600">Sign up to manage clinic appointments & records</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-8">
          {serverMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-medium text-red-800">{serverMsg}</p>
            </div>          
          )}

        <form onSubmit={handleCreateUser} className="space-y-4">
          <InputField
            icon={User}
            label="Full Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
            errors={errors}
          />

          <InputField
            icon={Mail}
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@clinic.com"
            required
            errors={errors}
          />

          <div className="grid grid-cols-2 gap-2">

          <InputField
            icon={Lock}
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            errors={errors}
          />

          <InputField
            icon={Lock}
            label="Confirm Password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Confirm password"
            required
            errors={errors}
          />

          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
        </form>

        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Already Have Credentials ? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login in</Link>
        </div>
      </div>
    </div>
  );
}
