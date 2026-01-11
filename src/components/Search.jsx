import { useState , useCallback } from "react";
import {Search} from "lucide-react"

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  debounce = false,
  delay = 400
}) => {
    
  const handleChange = (e) => {
    onChange(e.target.value);
  };

    console.log(value);
    
    return (
        <div>
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        className={`pl-10 pr-4 py-2.5 w-72 rounded-xl border-red-10 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 focus:bg-white outline-none transition-all duration-200 font-medium`}
                    />
                </div>
        </div>
    )
}

export default SearchInput
