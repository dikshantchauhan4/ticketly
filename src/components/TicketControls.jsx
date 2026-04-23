import { useEffect, useState } from "react";
import { ArrowRightLeft, UserCog, UserPlus, Users } from "lucide-react";
import { roleLabels, statusLabels } from "../lib/constants.js";

export function TicketControls({
  currentUser,
  departments,
  employees,
  onAssign,
  onStatus,
  onTransfer,
  teams,
  ticket
}) {
  const [transfer, setTransfer] = useState({
    departmentId: ticket.departmentId,
    teamId: ticket.teamId,
    reason: ""
  });
  const [assigneeId, setAssigneeId] = useState(ticket.assigneeId);
  const transferTeams = teams.filter((team) => team.departmentId === transfer.departmentId);
  const teamMembers = employees.filter(
    (employee) =>
      employee.active &&
      employee.departmentId === ticket.departmentId &&
      (!ticket.teamId || employee.teamId === ticket.teamId)
  );
  const canReassign =
    currentUser.role === "super_user" ||
    currentUser.role === "department_head" ||
    (currentUser.role === "team_leader" && currentUser.teamId === ticket.teamId);

  useEffect(() => {
    setTransfer({
      departmentId: ticket.departmentId,
      teamId: ticket.teamId,
      reason: ""
    });
    setAssigneeId(ticket.assigneeId);
  }, [ticket.id, ticket.departmentId, ticket.teamId, ticket.assigneeId]);

  function submitTransfer(event) {
    event.preventDefault();
    if (!transfer.departmentId || transfer.departmentId === ticket.departmentId) {
      return;
    }
    onTransfer({
      toDepartmentId: transfer.departmentId,
      toTeamId: transfer.teamId || transferTeams[0]?.id || "",
      reason: transfer.reason
    });
  }

  function submitAssign(event) {
    event.preventDefault();
    if (!assigneeId) {
      return;
    }
    const employee = employees.find((item) => item.id === assigneeId);
    onAssign({
      assigneeId,
      teamId: employee?.teamId || ticket.teamId
    });
  }

  return (
    <div className="grid gap-4">
      <h3 className="flex items-center gap-2 font-bold">
        <UserCog className="h-5 w-5 text-brand" />
        Ticket controls
      </h3>
      <label className="grid gap-1">
        <span className="label">Status</span>
        <select
          className="input"
          value={ticket.status}
          onChange={(event) => onStatus(event.target.value)}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {canReassign && (
        <form className="subtle-panel grid gap-3 p-3" onSubmit={submitAssign}>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" />
            <p className="text-sm font-bold">Reassign</p>
          </div>
          <select
            className="input"
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
          >
            <option value="">Select employee</option>
            {teamMembers.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {roleLabels[employee.role]}
              </option>
            ))}
          </select>
          <button className="btn btn-secondary" type="submit">
            <UserPlus className="h-4 w-4" />
            Assign
          </button>
        </form>
      )}
      <form className="subtle-panel grid gap-3 p-3" onSubmit={submitTransfer}>
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-brand" />
          <p className="text-sm font-bold">Transfer department</p>
        </div>
        <select
          className="input"
          value={transfer.departmentId}
          onChange={(event) =>
            setTransfer({ departmentId: event.target.value, teamId: "", reason: "" })
          }
        >
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={transfer.teamId}
          onChange={(event) =>
            setTransfer((current) => ({ ...current, teamId: event.target.value }))
          }
        >
          <option value="">Auto route team</option>
          {transferTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <textarea
          className="input min-h-20 resize-y"
          value={transfer.reason}
          onChange={(event) =>
            setTransfer((current) => ({ ...current, reason: event.target.value }))
          }
          placeholder="Reason for transfer"
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={transfer.departmentId === ticket.departmentId}
        >
          <ArrowRightLeft className="h-4 w-4" />
          Transfer ticket
        </button>
      </form>
    </div>
  );
}
