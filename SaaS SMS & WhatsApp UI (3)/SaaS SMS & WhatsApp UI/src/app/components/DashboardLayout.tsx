import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Send,
  Calendar,
  ScrollText,
  Settings,
  MessageSquare,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";

interface DashboardLayoutProps {
  onLogout?: () => void;
}

export default function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Templates", href: "/templates", icon: FileText },
    { name: "Send Message", href: "/send-message", icon: Send },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Message Logs", href: "/logs", icon: ScrollText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: Shield },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "API Configuration", href: "/admin/api-config", icon: Settings },
    { name: "System Logs", href: "/admin/system-logs", icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
          <div className="bg-blue-600 p-2 rounded-lg">
            <MessageSquare className="size-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">MessageHub</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="size-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </div>
            {adminNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="size-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-gray-900/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className="w-64 h-full bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <MessageSquare className="size-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  MessageHub
                </span>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="px-4 py-6 space-y-8">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <item.icon className="size-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}
              </div>

              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </div>
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    <item.icon className="size-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>

            <div className="flex-1 lg:flex-none"></div>

            <div className="flex items-center gap-4">
              {/* User Dropdown Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                    TR
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      Thisara Randika
                    </div>
                    <div className="text-xs text-gray-500">Administrator</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        Thisara Randika
                      </div>
                      <div className="text-xs text-gray-500">Administrator</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/admin/api-config");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="size-4" />
                        Settings
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100"></div>

                    {/* Logout */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}

                {/* Close menu when clicking outside */}
                {isUserMenuOpen && (
                  <div
                    className="fixed inset-0"
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
