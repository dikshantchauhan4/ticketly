import { AdminPanel } from "../components/AdminPanel.jsx";

export function AdminPage({
  currentUser,
  departments,
  employees,
  onCreateDepartment,
  onCreateEmployee,
  onCreateTeam,
  teams
}) {
  return (
    <AdminPanel
      currentUser={currentUser}
      departments={departments}
      employees={employees}
      teams={teams}
      onCreateDepartment={onCreateDepartment}
      onCreateEmployee={onCreateEmployee}
      onCreateTeam={onCreateTeam}
    />
  );
}
