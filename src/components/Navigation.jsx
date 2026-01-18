import React, { useState } from 'react';
import { Link, Navigate , NavLink } from 'react-router-dom';
import UserAccountButton from './userAccountButton.jsx';

import { 
  Database, 
  FileText, 
  Paperclip, 
  Play, 
  Bell, 
  Grid3x3, 
  Webhook, 
  Settings, 
  HelpCircle, 
  MessageSquare,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function Navigation() {

  const [isCollapsed, setIsCollapsed] = useState(true);

  const navigationItems = [
    { icon: Database, label: 'Patient', to:"/Patients" },
    { icon: FileText, label: 'Doctor Screen', to:"/DoctorScreen" },
    { icon: Paperclip, label: 'Visit History' , to:"/VisitHistory"},
    { icon: Play, label: 'Patient List', to:"/PatientList"},
  ];

  const bottomNavigationItems = [
    { icon: Bell, label: 'Notifications'},
    { icon: Grid3x3, label: 'Guide' , to:"/Guide"},
    { icon: Grid3x3, label: 'Apps' },
    { icon: Webhook, label: 'Webhooks' },
    { icon: Settings, label: 'Project Settings' },
    { icon: HelpCircle, label: 'Help' },
    { icon: MessageSquare, label: 'Contact support' }
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">PN</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Project Name</div>
                <div className="text-xs text-gray-500">Master Environment</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </>
          )}
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 p-2">
        {navigationItems.map((item, index) => (
          (
            <NavLink
              to={item.to}
              key={index}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg cursor-pointer mb-1 group relative
                ${isCollapsed ? 'justify-center' : 'space-x-3'}
                ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`
              }
              title={isCollapsed ? item.label : ''}
              style={{ textDecoration: 'none' }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          )
        ))}
         </div>

    {/* Bottom Navigation */}
      <div className="p-2 border-t border-gray-200">
        {bottomNavigationItems.map((item, index) => (
          <Link
            to={item.to || ''}
            key={index}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-50 mb-1 group relative`}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}
        
        
        {/* Account */}
        <UserAccountButton isCollapsed={isCollapsed} />
      </div>
      
      {/* Toggle Button - Centered on right edge */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="c absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm z-10"
      >
        {isCollapsed ? (
          <ChevronDown className="w-3 h-3 text-gray-600 rotate-90 cursor-pointer" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-600 -rotate-90 cursor-pointer" />
        )}
      </button>
    </div>
  
  );
}