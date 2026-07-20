import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Home, FileText, LogOut, Search, Bell, PanelLeftClose, PanelRightClose, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'new', label: 'New Report', path: '/new', icon: Home },
    { id: 'reports', label: 'Reports', path: '/reports', icon: FileText },
  ];

  // Determine title based on route
  const getPageTitle = () => {
    if (location.pathname.includes('/new')) return 'New Report';
    if (location.pathname.includes('/reports')) return 'Reports';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#F6F7FB] text-[#0D212C] font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 80 : 260,
          x: mobileOpen ? 0 : (window.innerWidth < 768 ? -260 : 0)
        }}
        transition={{ ease: "easeInOut", duration: 0.2 }}
        className="fixed md:relative z-50 h-full bg-[#0D212C] flex flex-col shadow-lg"
      >
        <div className="p-5 flex items-center justify-between h-20 shrink-0">
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                <img src="/logo.png" alt="M42 Logo" className="h-6 object-contain shrink-0" />
                <div className="flex flex-col">
                   <span className="font-medium text-[13px] text-white leading-tight font-['Poppins']">News & Trends</span>
                   <span className="font-medium text-[13px] text-white leading-tight font-['Poppins']">Agent</span>
                </div>
              </div>
              <button onClick={() => setCollapsed(true)} className="text-white/50 hover:text-white transition-colors">
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>
          )}
          {collapsed && (
            <div className="w-full flex flex-col items-center gap-4">
              <button onClick={() => setCollapsed(false)} className="text-white/50 hover:text-white transition-colors">
                <PanelRightClose className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#153443] text-white font-medium'
                    : 'text-[#FFFFFF94] hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#36c0c9]' : 'text-[#FFFFFF94]'}`} />
                  {!collapsed && <span className="text-[14px]">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile Details at bottom with 20px padding */}
        <div className="pb-[20px] px-4 border-t border-white/10 pt-4 mt-auto">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3 p-2 rounded-xl relative`}>
            <div className="w-9 h-9 rounded-full bg-[#36c0c9] text-[#0D212C] flex items-center justify-center font-semibold text-sm shrink-0">
              {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'AJ'}
            </div>
            {!collapsed && (
              <div className="flex-1 flex justify-between items-center overflow-hidden">
                <div className="flex flex-col truncate pr-2">
                  <span className="text-[14px] font-medium text-white truncate">{user?.name || 'Ashika Jain'}</span>
                  <span className="text-xs text-[#FFFFFF94] truncate">{user?.role === 'strategy' ? 'Strategy User' : 'General User'}</span>
                </div>
                <button onClick={handleLogout} className="text-[#FFFFFF94] hover:text-white transition-colors" title="Log out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            {collapsed && (
              <button onClick={handleLogout} className="text-[#FFFFFF94] hover:text-white transition-colors absolute inset-0 flex items-center justify-center bg-[#0D212C] rounded-xl opacity-0 hover:opacity-100" title="Log out">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F6F7FB]">
        {/* Topbar */}
        <header className="h-20 bg-transparent flex items-center justify-between px-6 md:px-10 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold font-['Poppins'] text-[#0D212C] hidden md:block">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search reports, topics, or keywords..." 
                className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#36c0c9] transition-colors placeholder-gray-400 text-gray-700 shadow-sm" 
              />
            </div>
            <div className="relative cursor-pointer hover:bg-white/50 p-2 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#36c0c9] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-[#F6F7FB]">
                3
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-[#F6F7FB] relative">
          <div className="relative z-10 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}