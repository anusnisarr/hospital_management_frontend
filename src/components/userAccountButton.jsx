import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { AuthStore } from '../store/AuthStore';
import { logout } from '../api/services/AuthService';


export default function UserAccountButton({ isCollapsed = false }) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails , setUserDetails] = useState({name:"", email:"", role:"", avatar:""});
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    getProfileDetails();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout("User Log Out");
  };

  const getProfileDetails = () => {
    

    setUserDetails(AuthStore.getUser());
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // Navigate to settings page
  };

  const handleHelp = () => {
    console.log('Opening help...');
    // Navigate to help/support page
  };

  const getPlaceholderAvatar = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative justify-self-center" ref={dropdownRef}>    
      
      {/* Account Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full ${
          isCollapsed ? 'justify-center' : 'justify-between'
        } px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-all group relative border border-transparent hover:border-slate-200`}
        title={isCollapsed ? userDetails.name : ''}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          {userDetails.avatar ? (
            <img 
              src={userDetails.avatar} 
              alt={userDetails.name}
              className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-slate-200"
            />
          ) : (
            <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">
              {getPlaceholderAvatar(userDetails.name)}
            </div>
          )}

          {/* User Info - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{userDetails.name}</p>
              <p className="text-xs text-slate-500 truncate">{userDetails.role}</p>
            </div>
          )}
        </div>

        {/* Chevron - Hidden when collapsed */}
        {!isCollapsed && (
          <ChevronDown 
            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        )}

        {/* Tooltip for collapsed state - Only show when NOT open */}
        {isCollapsed && !isOpen && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            <div className="font-bold">{userDetails.name}</div>
            <div className="text-slate-300">{userDetails.role}</div>
          </div>
        )}
      </button>

      {/* Dropdown Menu - Shows for both collapsed and expanded */}
      {isOpen && (
        <div 
          className={`absolute bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 animate-slideUp ${
            isCollapsed 
              ? 'bottom-0 left-full ml-2 w-56' // Collapsed: appears to the right
              : 'bottom-full left-0 right-0 mb-2' // Expanded: appears above
          }`}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-900">{userDetails.name}</p>
            <p className="text-xs text-slate-500">{userDetails.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <MenuItem 
              icon={Settings} 
              label="Settings" 
              onClick={handleSettings}
            />
            <MenuItem 
              icon={HelpCircle} 
              label="Help & Support" 
              onClick={handleHelp}
            />
          </div>

          {/* Logout - Separated */}
          <div className="border-t border-slate-100">
            <MenuItem 
              icon={LogOut} 
              label="Log out" 
              onClick={handleLogout}
              danger
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

// Menu Item Component
function MenuItem({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
