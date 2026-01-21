import * as ImportIcons from "lucide-react";

import { useState } from "react";
export const TextInputField = ({
  labelText,
  iconName,
  type,
  name,
  value,
  onChange,
  placeholder,
  errors,
}) => {

  const Icon = ImportIcons[iconName ? iconName : ""];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {labelText}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`pl-10 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors ? "border-red-500" : "border-gray-300"
            }`}
          placeholder={placeholder}
        />
      </div>
      {errors}
    </div>
  );
};

export const InputField = ({ name , type , errors, icon: Icon, label, ...props }) => {

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        <input
          {...props}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <ImportIcons.EyeOff className="w-5 h-5" /> : <ImportIcons.Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {errors?.[name] && (
        <p className="text-xs text-red-600 mt-1">
          {errors[name]}
        </p>
      )}

    </div>
  );
}