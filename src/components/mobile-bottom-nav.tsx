import { Link, useLocation } from "react-router";
import { Home, Briefcase, Users, Settings, BarChart3 } from "lucide-react";

export function MobileBottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Jobs", icon: Briefcase },
    { path: "/comm-builder", label: "Coach", icon: Users },
    { path: "/dashboard?tab=stats", label: "Stats", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path.includes('tab=stats') && location.search.includes('tab=stats'));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px] ${
                isActive
                  ? "text-[#3182CE]"
                  : "text-[#64748B] hover:text-[#1A202C]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-[#3182CE]/10' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
