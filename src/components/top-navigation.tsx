import { Briefcase, FileText, Home, LogOut, Menu, Settings, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";

interface TopNavigationProps {
  onMenuClick?: () => void;
}

export function TopNavigation({ onMenuClick }: TopNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, signOut } = useApp();
  const { isAuthenticated, currentUser } = state;
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: Briefcase },
    { path: "/comm-builder", label: "Coach", icon: Users },
    { path: "/cv-builder", label: "CV", icon: FileText },
    { path: "/profile", label: "Profile", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-[#1A202C] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3182CE] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline">The Student Co-op</span>
              <span className="font-semibold text-lg sm:hidden">Student Co-op</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#3182CE] text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile / Auth Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated && currentUser ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-full bg-white/10 text-white hover:bg-white/20 hidden sm:flex"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <div className="w-9 h-9 rounded-full bg-[#3182CE] flex items-center justify-center text-sm font-semibold">
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-white hover:bg-white/10 hidden sm:flex"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="rounded-full bg-[#3182CE] text-white hover:bg-[#2C5AA0]"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}