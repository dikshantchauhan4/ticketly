import { Moon, Sun } from "lucide-react";
import { roleLabels } from "../lib/constants.js";

export function SettingsPage({ currentUser, onThemeChange, theme }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
      <section className="panel p-4">
        <h2 className="font-bold">User preferences</h2>
        <div className="mt-4 grid gap-3">
          <button
            className={`btn justify-start ${theme === "theme-light" ? "btn-primary" : "btn-secondary"}`}
            type="button"
            onClick={() => onThemeChange("theme-light")}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            className={`btn justify-start ${theme === "theme-dark" ? "btn-primary" : "btn-secondary"}`}
            type="button"
            onClick={() => onThemeChange("theme-dark")}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
        </div>
      </section>
      <section className="panel p-4">
        <h2 className="font-bold">Account</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Info label="Name" value={currentUser.name} />
          <Info label="Email" value={currentUser.email} />
          <Info label="Role" value={roleLabels[currentUser.role]} />
          <Info label="Status" value={currentUser.active ? "Active" : "Inactive"} />
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="subtle-panel p-3">
      <p className="label">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
