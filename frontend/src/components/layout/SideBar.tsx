import {
  BookCopy,
  Clapperboard,
  Database,
  Gamepad2,
  LayoutDashboard,
  TvMinimal,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      wip: false,
    },
    { name: "Games", href: "/games", icon: Gamepad2, wip: false },
    { name: "Anime", href: "/anime", icon: Database, wip: false },
    { name: "Manga", href: "/manga", icon: BookCopy, wip: true },
    { name: "Movies", href: "/movies", icon: Clapperboard, wip: true },
    { name: "TV Shows", href: "/tv-shows", icon: TvMinimal, wip: true },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col border-r-2 border-purple-500 ">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href;

        if (item.wip) {
          return (
            <div
              key={item.name}
              className="flex items-center px-4 py-2 border-l-2 border-purple-500 bg-gray-700/50 cursor-not-allowed"
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.name}
            </div>
          );
        }

        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-4 py-2 border-l-2 transition-colors duration-200 ${
              isActive
                ? "border-purple-500 bg-gray-700/50"
                : "border-transparent hover:bg-purple-900/20"
            }`}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
}
