// Login.jsx
import { useState, useContext } from "react";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import { Link } from 'react-router-dom';
import clsx from "clsx"; // optional: for conditional classnames
const env = import.meta.env
import { useNavigate } from 'react-router-dom';
import { AuthStore } from "../store/AuthStore";
import { InputField } from '../components/inputFields';

// simple axios helper (replace baseURL with your env var)
const API = axios.create({ baseURL: `${env.VITE_BASE_PATH}/auth` || "" });

export default function Login({ onSuccess }) {

  const setAccessToken = AuthStore.setAccessToken;
  const setUser = AuthStore.setUser;
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();


  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password.trim()) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be 6+ characters";
    setErrors(e);
    return Object.keys(e).length === 0;
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

  const handleSubmit = async (ev) => {
    ev?.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await API.post("/login", {
        email: form.email,
        password: form.password,
        remember: form.remember
      }, {
        withCredentials: true
      });

      setAccessToken(res.data.accessToken)
      console.log(res.data.user);
      
      setUser(res.data.user)

      onSuccess?.(res.data);
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-[15px] font-medium text-slate-600">
            Sign in to your clinic dashboard
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-8">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-medium text-red-800">{serverError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              icon={Mail}
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@cityhospital.com"
              required
              errors={errors}
            />

            <InputField
              icon={Lock}
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              required
            />

            <div className="flex items-center justify-between text-sm">
              
              <label className="inline-flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span className="text-slate-600">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Implement forgot password flow")}
                className="cursor-pointer font-bold text-indigo-600 hover:text-indigo-700"
              >
                 Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

        </div>

        <p className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700">Start Free Trial</Link>
        </p>
      </div>
    </div>
  );
}
