import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CheckSquare,
  Flame,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";
import toastr from "toastr";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toastr.success("Logged out successfully.");
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      label: "Habits",
      path: "/habits",
      icon: Flame,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      label: "AI Reminders",
      path: "/ai-reminders",
      icon: Bell,
    },
  ];

  return (
    <aside className="app-sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Sparkles size={22} />
          </div>

          <div>
            <h5 className="mb-0 fw-bold">SmartTrack</h5>
            <small>AI Productivity</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
