import { Search } from "lucide-react";
import { statusClass, statusLabels } from "../lib/constants.js";
import { byId, getTat } from "../lib/ticketUtils.js";

export function TicketList({
  activeTicketId,
  departments,
  employees,
  onSearch,
  onSelect,
  onStatusFilter,
  search,
  statusFilter,
  teams,
  tickets
}) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold">Ticket queue</h2>
          <span className="text-sm font-semibold text-muted">{tickets.length}</span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="input pl-9"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search tickets"
            />
          </label>
          <select
            className="input"
            value={statusFilter}
            onChange={(event) => onStatusFilter(event.target.value)}
          >
            <option value="all">All status</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="max-h-[760px] overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="p-5 text-sm text-muted">No tickets match this view.</div>
        ) : (
          tickets.map((ticketItem) => {
            const department = byId(departments, ticketItem.departmentId);
            const team = byId(teams, ticketItem.teamId);
            const assignee = byId(employees, ticketItem.assigneeId);
            const tat = getTat(ticketItem);
            return (
              <button
                key={ticketItem.id}
                className={`block w-full border-b border-line p-4 text-left transition hover:bg-elevated ${
                  activeTicketId === ticketItem.id ? "bg-elevated" : "bg-surface"
                }`}
                type="button"
                onClick={() => onSelect(ticketItem.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-sm font-bold">{ticketItem.title}</h3>
                  <span className={`status-pill ${statusClass[ticketItem.status]}`}>
                    {statusLabels[ticketItem.status]}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {ticketItem.description}
                </p>
                <div className="mt-3 grid gap-1 text-xs text-muted">
                  <span>
                    {department?.name ?? "Unknown department"} /{" "}
                    {team?.name ?? "Unassigned team"}
                  </span>
                  <span>Owner: {assignee?.name ?? "Unassigned"}</span>
                  <span className={tat.tone}>TAT: {tat.label}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
