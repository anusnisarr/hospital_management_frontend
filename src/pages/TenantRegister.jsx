import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, User, Lock, ArrowRight, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { InputField } from '../components/inputFields';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiInstance';

export function TenantRegister() {
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Business Info
    businessName: '',
    slug: '',
    businessEmail: '',
    phone: '',
    businessType: 'clinic',
    
    // Address
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    
    // Admin User
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
    if (formData.businessName && step === 1) {
      const newSlug = generateSlug(formData.businessName);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.businessName]);

  useEffect(() => {
    const checkSlug = async () => {
      if (formData.slug && formData.slug.length >= 3) {
        setCheckingSlug(true);
        try {
          const response = await API.post(`/api/public/check-slug/${formData.slug}`);
          const data = response.data;
          setSlugAvailable(data.available);
        } catch (err) {
          console.error('Error checking slug:', err);
        } finally {
          setCheckingSlug(false);
        }
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
  setLoading(true);

  const body = {
    businessName: formData.businessName,
    businessEmail: formData.businessEmail,
    phone: formData.phone,
    businessType: formData.businessType,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode
    },
    adminName: formData.adminName,
    adminEmail: formData.adminEmail,
    adminPassword: formData.adminPassword
  };

  const response = await API.post("/public/register", body);
  
  const { success, data, message } = response.data;
  
  if (!success) {
    setError(message || "Registration failed");
    return;
  }

  navigate(`/${data.tenant.slug}/login`, { replace: true });

} catch (err) {
  console.error("Tenant registration error:", err);

  const apiMessage =
    err?.response?.data?.message ||
    "Failed to register tenant. Please try again.";

  setError(apiMessage);

} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
            Start Your Free Trial
          </h1>
          <p className="text-[15px] font-medium text-slate-600">
            Set up your clinic management system in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <StepIndicator number={1} label="Business Info" active={step === 1} completed={step > 1} />
            <div className="flex-1 h-0.5 bg-slate-200 mx-4">
              <div className={`h-full bg-indigo-500 transition-all ${step > 1 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <StepIndicator number={2} label="Address" active={step === 2} completed={step > 2} />
            <div className="flex-1 h-0.5 bg-slate-200 mx-4">
              <div className={`h-full bg-indigo-500 transition-all ${step > 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <StepIndicator number={3} label="Admin User" active={step === 3} completed={false} />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Business Information */}
            {step === 1 && (
              <div className="p-8">
                <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight mb-6">
                  Business Information
                </h2>

                <div className="space-y-5">
                  <InputField
                    icon={Building2}
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="City Care Hospital"
                    required
                  />

                  {/* Slug Preview */}
                  {formData.slug && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Your URL</span>
                        {checkingSlug && (
                          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                        )}
                        {!checkingSlug && slugAvailable === true && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <Check className="w-3 h-3" /> Available
                          </span>
                        )}
                        {!checkingSlug && slugAvailable === false && (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                            <X className="w-3 h-3" /> Not Available
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">yourapp.com/</span>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none"
                          pattern="^[a-z0-9-]+$"
                          required
                        />
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Only lowercase letters, numbers, and hyphens</p>
                    </div>
                  )}

                  <InputField
                    icon={Mail}
                    label="Business Email"
                    name="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    placeholder="contact@cityhospital.com"
                    required
                  />

                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Type</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none"
                    >
                      <option value="clinic">Clinic</option>
                      <option value="hospital">Hospital</option>
                      <option value="diagnostic-center">Diagnostic Center</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!formData.businessName || !formData.businessEmail || slugAvailable === false}
                    className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="p-8">
                <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight mb-6">
                  Business Address
                </h2>

                <div className="space-y-5">
                  <InputField
                    icon={MapPin}
                    label="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                    />
                    <InputField
                      label="State/Province"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="United States"
                    />
                    <InputField
                      label="ZIP/Postal Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Admin User */}
            {step === 3 && (
              <div className="p-8">
                <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight mb-6">
                  Create Admin Account
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}

                <div className="space-y-5">
                  <InputField
                    icon={User}
                    label="Full Name"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Dr. John Smith"
                    required
                  />

                  <InputField
                    icon={Mail}
                    label="Email Address"
                    name="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="john@cityhospital.com"
                    required
                  />

                  <InputField
                    icon={Lock}
                    label="Password"
                    name="adminPassword"
                    type="password"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />

                  <InputField
                    icon={Lock}
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />

                  {formData.adminPassword && formData.confirmPassword && 
                   formData.adminPassword !== formData.confirmPassword && (
                    <p className="text-sm font-medium text-red-600">Passwords do not match</p>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.adminPassword !== formData.confirmPassword}
                    className="flex-1 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Registration <Check className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-6">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <a href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );

}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
        completed ? 'bg-emerald-500 text-white' :
        active ? 'bg-indigo-500 text-white' :
        'bg-slate-100 text-slate-400'
      }`}>
        {completed ? <Check className="w-5 h-5" /> : number}
      </div>
      <span className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}

