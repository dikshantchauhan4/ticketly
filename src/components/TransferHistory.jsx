import { byId, formatDate } from "../lib/ticketUtils.js";

export function TransferHistory({ departments, employees, teams, ticket }) {
  return (
    <div className="mt-5 border-t border-line pt-5">
      <h3 className="font-bold">History</h3>
      <div className="mt-3 grid gap-3">
        {ticket.transfers.length === 0 ? (
          <p className="text-sm text-muted">No department transfers yet.</p>
        ) : (
          ticket.transfers.map((transfer) => {
            const fromDepartment = byId(departments, transfer.fromDepartmentId);
            const toDepartment = byId(departments, transfer.toDepartmentId);
            const fromTeam = byId(teams, transfer.fromTeamId);
            const toTeam = byId(teams, transfer.toTeamId);
            const actor = byId(employees, transfer.transferredById);
            return (
              <article key={transfer.id} className="subtle-panel p-3 text-sm">
                <p className="font-semibold">
                  {fromDepartment?.name ?? "Unknown"} / {fromTeam?.name ?? "Unassigned"} to{" "}
                  {toDepartment?.name ?? "Unknown"} / {toTeam?.name ?? "Unassigned"}
                </p>
                <p className="mt-1 text-muted">{transfer.reason || "No reason provided."}</p>
                <p className="mt-2 text-xs text-muted">
                  {actor?.name ?? "Unknown"} - {formatDate(transfer.createdAt)}
                </p>
              </article>
            );
          })
        )}
        <div className="grid gap-2">
          {ticket.history.map((event) => {
            const actor = byId(employees, event.actorId);
            return (
              <div key={event.id} className="border-l-2 border-brand/50 pl-3 text-sm">
                <p className="font-semibold">{event.message}</p>
                <p className="text-xs text-muted">
                  {actor?.name ?? "System"} - {formatDate(event.createdAt)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
