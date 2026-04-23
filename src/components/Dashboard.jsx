import { Building2, CheckCircle2, Clock3, ShieldCheck, Ticket, UserCog, Users } from "lucide-react";

export function Dashboard({ departments, employees, teams, tickets }) {
  const unresolved = tickets.filter(
    (ticket) => !["resolved", "closed"].includes(ticket.status)
  );
  const metrics = [
    {
      label: "Visible tickets",
      value: tickets.length,
      icon: Ticket
    },
    {
      label: "Pending work",
      value: unresolved.length,
      icon: Clock3
    },
    {
      label: "Resolved",
      value: tickets.filter((ticket) => ticket.status === "resolved").length,
      icon: CheckCircle2
    },
    {
      label: "TAT breached",
      value: unresolved.filter((ticket) => new Date(ticket.dueAt).getTime() < Date.now()).length,
      icon: ShieldCheck
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.label} className="panel p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="label">{metric.label}</p>
                <p className="mt-2 text-3xl font-bold">{metric.value}</p>
              </div>
              <div
                className="grid h-11 w-11 place-items-center bg-elevated text-brand"
                style={{ borderRadius: 8 }}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
      <div className="panel p-4 md:col-span-2 xl:col-span-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <MiniSummary icon={Building2} label="Departments" value={departments.length} />
          <MiniSummary icon={Users} label="Teams" value={teams.length} />
          <MiniSummary icon={UserCog} label="Employees" value={employees.length} />
        </div>
      </div>
    </section>
  );
}

function MiniSummary({ icon: Icon, label, value }) {
  return (
    <div className="subtle-panel flex items-center justify-between gap-4 p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-brand" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="text-lg font-bold">{value}</span>
    </div>
  );
}
