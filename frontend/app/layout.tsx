// app/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { Calendar, Home, LightbulbIcon } from "lucide-react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={20} /> },
     { name: "Tips", path: "/tips", icon: <LightbulbIcon size={20} /> },
  ];

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-a text-black flex flex-col pt-8 px-4">
          <h1 className="text-2xl font-semibold mb-8">UniPlanner</h1>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-b transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}