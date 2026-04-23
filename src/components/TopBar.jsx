import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  ShieldCheck,
  Ticket,
  Tickets
} from "lucide-react";
import { roleLabels } from "../lib/constants.js";

const basePages = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tickets", label: "Tickets", icon: Tickets },
  { id: "new-ticket", label: "New Ticket", icon: PlusCircle },
  { id: "settings", label: "Settings", icon: Settings }
];

export function TopBar({ activePage, canManageAdmin, currentUser, onLogout, onNavigate }) {
  const pages = canManageAdmin
    ? [
        ...basePages.slice(0, 3),
        { id: "admin", label: "Admin", icon: ShieldCheck },
        basePages[3]
      ]
    : basePages;

  return (
    <header className="panel overflow-hidden">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center bg-brand text-brandInk"
            style={{ borderRadius: 8 }}
          >
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-normal">Ticketly</h1>
            <p className="text-sm text-muted">Department ticketing and service operations</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm">
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-muted">{roleLabels[currentUser.role]}</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-line bg-elevated px-3 py-2">
        {pages.map((page) => {
          const Icon = page.icon;
          const isActive = activePage === page.id;
          return (
            <button
              key={page.id}
              className={`btn whitespace-nowrap ${
                isActive ? "btn-primary" : "btn-secondary"
              }`}
              type="button"
              onClick={() => onNavigate(page.id)}
            >
              <Icon className="h-4 w-4" />
              {page.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
