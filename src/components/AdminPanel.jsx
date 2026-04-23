import { useEffect, useMemo, useState } from "react";
import { Building2, ShieldCheck, UserPlus, Users } from "lucide-react";
import { roleLabels } from "../lib/constants.js";
import { canCreateDepartment, canManageDepartment } from "../lib/ticketUtils.js";

export function AdminPanel({
  currentUser,
  departments,
  employees,
  onCreateDepartment,
  onCreateEmployee,
  onCreateTeam,
  teams
}) {
  const accessibleDepartments = useMemo(
    () => departments.filter((department) => canManageDepartment(currentUser, department.id)),
    [currentUser, departments]
  );
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
    slaHours: 24,
    headId: ""
  });
  const [teamForm, setTeamForm] = useState({
    departmentId: accessibleDepartments[0]?.id ?? "",
    name: "",
    leaderId: ""
  });
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    role: "employee",
    departmentId: accessibleDepartments[0]?.id ?? "",
    teamId: ""
  });

  useEffect(() => {
    if (!employeeForm.departmentId && accessibleDepartments[0]?.id) {
      setEmployeeForm((current) => ({
        ...current,
        departmentId: accessibleDepartments[0].id
      }));
    }
    if (!teamForm.departmentId && accessibleDepartments[0]?.id) {
      setTeamForm((current) => ({
        ...current,
        departmentId: accessibleDepartments[0].id
      }));
    }
  }, [accessibleDepartments, employeeForm.departmentId, teamForm.departmentId]);

  const teamOptions = teams.filter((team) => team.departmentId === employeeForm.departmentId);
  const leaderOptions = employees.filter(
    (employee) =>
      employee.active &&
      employee.departmentId === teamForm.departmentId &&
      ["team_leader", "department_head", "super_user"].includes(employee.role)
  );
  const headOptions = employees.filter((employee) =>
    ["department_head", "super_user"].includes(employee.role)
  );

  function submitDepartment(event) {
    event.preventDefault();
    if (!departmentForm.name.trim() || !canCreateDepartment(currentUser)) {
      return;
    }
    onCreateDepartment(departmentForm);
    setDepartmentForm({ name: "", description: "", slaHours: 24, headId: "" });
  }

  function submitTeam(event) {
    event.preventDefault();
    if (!teamForm.name.trim() || !teamForm.departmentId) {
      return;
    }
    onCreateTeam(teamForm);
    setTeamForm((current) => ({ ...current, name: "", leaderId: "" }));
  }

  function submitEmployee(event) {
    event.preventDefault();
    if (!employeeForm.name.trim() || !employeeForm.email.trim() || !employeeForm.departmentId) {
      return;
    }
    onCreateEmployee({
      ...employeeForm,
      teamId: employeeForm.teamId || teamOptions[0]?.id || ""
    });
    setEmployeeForm((current) => ({
      ...current,
      name: "",
      email: ""
    }));
  }

  return (
    <section className="panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand" />
          <h2 className="font-bold">Admin setup</h2>
        </div>
        <p className="text-sm text-muted">
          {roleLabels[currentUser.role]} permissions applied
        </p>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {canCreateDepartment(currentUser) && (
          <form className="subtle-panel grid gap-3 p-3" onSubmit={submitDepartment}>
            <h3 className="font-semibold">New department</h3>
            <input
              className="input"
              value={departmentForm.name}
              onChange={(event) =>
                setDepartmentForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Department name"
            />
            <textarea
              className="input min-h-20 resize-y"
              value={departmentForm.description}
              onChange={(event) =>
                setDepartmentForm((current) => ({
                  ...current,
                  description: event.target.value
                }))
              }
              placeholder="Department purpose"
            />
            <input
              className="input"
              min="1"
              type="number"
              value={departmentForm.slaHours}
              onChange={(event) =>
                setDepartmentForm((current) => ({
                  ...current,
                  slaHours: event.target.value
                }))
              }
              placeholder="SLA hours"
            />
            <select
              className="input"
              value={departmentForm.headId}
              onChange={(event) =>
                setDepartmentForm((current) => ({
                  ...current,
                  headId: event.target.value
                }))
              }
            >
              <option value="">No head assigned</option>
              {headOptions.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" type="submit">
              <Building2 className="h-4 w-4" />
              Create department
            </button>
          </form>
        )}
        <form className="subtle-panel grid gap-3 p-3" onSubmit={submitTeam}>
          <h3 className="font-semibold">New team</h3>
          <select
            className="input"
            value={teamForm.departmentId}
            onChange={(event) =>
              setTeamForm({ departmentId: event.target.value, name: "", leaderId: "" })
            }
          >
            {accessibleDepartments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            value={teamForm.name}
            onChange={(event) =>
              setTeamForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Team name"
          />
          <select
            className="input"
            value={teamForm.leaderId}
            onChange={(event) =>
              setTeamForm((current) => ({ ...current, leaderId: event.target.value }))
            }
          >
            <option value="">No leader assigned</option>
            {leaderOptions.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">
            <Users className="h-4 w-4" />
            Create team
          </button>
        </form>
        <form className="subtle-panel grid gap-3 p-3" onSubmit={submitEmployee}>
          <h3 className="font-semibold">New employee</h3>
          <input
            className="input"
            value={employeeForm.name}
            onChange={(event) =>
              setEmployeeForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Employee name"
          />
          <input
            className="input"
            type="email"
            value={employeeForm.email}
            onChange={(event) =>
              setEmployeeForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="email@business.com"
          />
          <select
            className="input"
            value={employeeForm.role}
            onChange={(event) =>
              setEmployeeForm((current) => ({ ...current, role: event.target.value }))
            }
          >
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={employeeForm.departmentId}
            onChange={(event) =>
              setEmployeeForm({
                ...employeeForm,
                departmentId: event.target.value,
                teamId: ""
              })
            }
          >
            {accessibleDepartments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={employeeForm.teamId}
            onChange={(event) =>
              setEmployeeForm((current) => ({ ...current, teamId: event.target.value }))
            }
          >
            <option value="">Auto assign team</option>
            {teamOptions.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">
            <UserPlus className="h-4 w-4" />
            Create employee
          </button>
        </form>
      </div>
    </section>
  );
}
