import { Ticket } from "lucide-react";
import { priorityLabels, statusClass, statusLabels } from "../lib/constants.js";
import { byId, formatDate, getTat } from "../lib/ticketUtils.js";
import { ChatPanel } from "./ChatPanel.jsx";
import { TicketControls } from "./TicketControls.jsx";
import { TransferHistory } from "./TransferHistory.jsx";

export function TicketDetail({
  attachments,
  currentUser,
  departments,
  employees,
  messages,
  onAssign,
  onMessage,
  onStatus,
  onTransfer,
  teams,
  ticket
}) {
  if (!ticket) {
    return (
      <section className="panel grid min-h-[360px] place-items-center p-6 text-center">
        <div>
          <Ticket className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-3 font-semibold">No ticket selected</p>
          <p className="mt-1 text-sm text-muted">Create or select a ticket to view the workspace.</p>
        </div>
      </section>
    );
  }

  const ticketMessages = messages
    .filter((message) => message.ticketId === ticket.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const department = byId(departments, ticket.departmentId);
  const team = byId(teams, ticket.teamId);
  const creator = byId(employees, ticket.createdById);
  const assignee = byId(employees, ticket.assigneeId);
  const creatorDepartment = byId(departments, creator?.departmentId);
  const assigneeDepartment = byId(departments, assignee?.departmentId);
  const tat = getTat(ticket);

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-line p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`status-pill ${statusClass[ticket.status]}`}>
            {statusLabels[ticket.status]}
          </span>
          <span className="status-pill border-line bg-elevated text-ink">
            {priorityLabels[ticket.priority]} priority
          </span>
        </div>
        <h2 className="mt-3 text-xl font-bold tracking-normal sm:text-2xl">
          {ticket.title}
        </h2>
        <div className="mt-3 border-l-4 border-brand bg-elevated px-3 py-2">
          <p className="label">Issue</p>
          <p className="mt-1 text-sm leading-5 text-ink">{ticket.description}</p>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <PersonBlock
            label="Created by"
            name={creator?.name ?? "Unknown"}
            department={creatorDepartment?.name ?? "Unknown department"}
          />
          <PersonBlock
            label="Assigned to"
            name={assignee?.name ?? "Unassigned"}
            department={assigneeDepartment?.name ?? "No department yet"}
          />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoBlock label="Ticket department" value={department?.name ?? "Unknown"} />
          <InfoBlock label="Team" value={team?.name ?? "Unassigned"} />
          <InfoBlock label="Due" value={formatDate(ticket.dueAt)} />
          <div className="subtle-panel p-3">
            <p className="label">TAT</p>
            <p className={`mt-1 truncate text-sm font-semibold ${tat.tone}`}>
              {tat.label}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="p-4">
          <ChatPanel
            attachments={attachments}
            currentUser={currentUser}
            employees={employees}
            messages={ticketMessages}
            onSend={(payload) => onMessage({ ...payload, ticketId: ticket.id })}
          />
        </div>
        <aside className="border-t border-line p-4 xl:border-l xl:border-t-0">
          <TicketControls
            currentUser={currentUser}
            departments={departments}
            employees={employees}
            onAssign={(payload) => onAssign({ ...payload, ticketId: ticket.id })}
            onStatus={(status) => onStatus({ ticketId: ticket.id, status })}
            onTransfer={(payload) => onTransfer({ ...payload, ticketId: ticket.id })}
            teams={teams}
            ticket={ticket}
          />
          <TransferHistory
            departments={departments}
            employees={employees}
            teams={teams}
            ticket={ticket}
          />
        </aside>
      </div>
    </section>
  );
}

function PersonBlock({ department, label, name }) {
  return (
    <div className="subtle-panel p-3">
      <p className="label">{label}</p>
      <p className="mt-1 text-base font-bold">{name}</p>
      <p className="mt-1 text-sm text-muted">{department}</p>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="subtle-panel p-3">
      <p className="label">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
