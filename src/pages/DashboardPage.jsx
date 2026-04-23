import { Dashboard } from "../components/Dashboard.jsx";

export function DashboardPage({ departments, employees, teams, tickets }) {
  return (
    <div className="grid gap-5">
      <Dashboard
        departments={departments}
        employees={employees}
        teams={teams}
        tickets={tickets}
      />
      <section className="panel p-4">
        <h2 className="font-bold">Work overview</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Summary label="Open" value={tickets.filter((ticket) => ticket.status === "open").length} />
          <Summary
            label="In progress"
            value={tickets.filter((ticket) => ticket.status === "in_progress").length}
          />
          <Summary
            label="Waiting"
            value={tickets.filter((ticket) => ticket.status === "waiting_on_requester").length}
          />
        </div>
      </section>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="subtle-panel p-4">
      <p className="label">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
