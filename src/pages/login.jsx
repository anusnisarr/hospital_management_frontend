// Login.jsx
import { useState , useContext } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Link } from 'react-router-dom';
import clsx from "clsx"; // optional: for conditional classnames
const env = import.meta.env
import { useNavigate } from 'react-router-dom';
import { AuthStore } from "../store/AuthStore";

// simple axios helper (replace baseURL with your env var)
const API = axios.create({ baseURL: `${env.VITE_BASE_PATH}/auth` || "" });

export default function Login({ onSuccess }) {
  
  const setAccessToken = AuthStore.setAccessToken;
  const setUser = AuthStore.setUser;
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to access the clinic dashboard</p>
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-md">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-600">Email</span>
            <div className={clsx(
              "mt-1 relative rounded-lg border px-3 py-2 flex items-center",
              errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
            )}>
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors(prev => ({ ...prev, email: "" })); }}
                placeholder="you@clinic.com"
                className="flex-1 outline-none text-sm"
                aria-label="Email"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">Password</span>
            <div className={clsx(
              "mt-1 relative rounded-lg border px-3 py-2 flex items-center",
              errors.password ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
            )}>
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors(prev => ({ ...prev, password: "" })); }}
                placeholder="Your password"
                className="flex-1 outline-none text-sm"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="ml-2 p-1 rounded text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center space-x-2 text-gray-600">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert("Implement forgot password flow")}
              className="text-blue-600 hover:underline"
            >
              Forgot?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">Create account</Link>
        </div>
      </div>
    </div>
  );
}
