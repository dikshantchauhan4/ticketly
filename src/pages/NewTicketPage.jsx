import { TicketComposer } from "../components/TicketComposer.jsx";

export function NewTicketPage({ departments, onCreate, teams }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,720px)_minmax(260px,1fr)]">
      <TicketComposer departments={departments} teams={teams} onCreate={onCreate} />
      <section className="panel p-4">
        <h2 className="font-bold">Routing snapshot</h2>
        <div className="mt-4 grid gap-3">
          {departments.map((department) => (
            <div key={department.id} className="subtle-panel p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{department.name}</p>
                <p className="text-sm text-muted">{department.slaHours}h SLA</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                {teams.filter((team) => team.departmentId === department.id).length} teams
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
