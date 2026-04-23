import { TicketDetail } from "../components/TicketDetail.jsx";
import { TicketList } from "../components/TicketList.jsx";

export function TicketsPage({
  activeTicket,
  activeTicketId,
  attachments,
  currentUser,
  departments,
  employees,
  messages,
  onAssign,
  onMessage,
  onSearch,
  onSelect,
  onStatus,
  onStatusFilter,
  onTransfer,
  search,
  statusFilter,
  teams,
  tickets
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <TicketList
        activeTicketId={activeTicketId}
        departments={departments}
        employees={employees}
        search={search}
        statusFilter={statusFilter}
        teams={teams}
        tickets={tickets}
        onSearch={onSearch}
        onStatusFilter={onStatusFilter}
        onSelect={onSelect}
      />
      <TicketDetail
        attachments={attachments}
        currentUser={currentUser}
        departments={departments}
        employees={employees}
        messages={messages}
        teams={teams}
        ticket={activeTicket}
        onAssign={onAssign}
        onMessage={onMessage}
        onStatus={onStatus}
        onTransfer={onTransfer}
      />
    </div>
  );
}
