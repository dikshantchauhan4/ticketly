import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock3 } from "lucide-react";
import { TopBar } from "./components/TopBar.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { NewTicketPage } from "./pages/NewTicketPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { TicketsPage } from "./pages/TicketsPage.jsx";
import {
  assignTicket,
  bootstrapApp,
  createDepartment,
  createEmployee,
  createTeam,
  createTicket,
  login,
  logout,
  sendMessage,
  setActivePage,
  setActiveTicket,
  setSearch,
  setStatusFilter,
  setTheme,
  transferTicket,
  updateTicketStatus
} from "./store/ticketSlice.js";
import { byId, canManage, canViewTicket, sortByUpdatedAt } from "./lib/ticketUtils.js";

export default function App() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.ticketly);
  const {
    activeTicketId,
    activePage,
    attachments,
    currentUserId,
    departments,
    employees,
    error,
    loading,
    messages,
    search,
    statusFilter,
    teams,
    theme,
    tickets
  } = state;
  const currentUser = byId(employees, currentUserId);

  useEffect(() => {
    dispatch(bootstrapApp());
  }, [dispatch]);

  useEffect(() => {
    window.localStorage.setItem("ticketly.theme", theme);
  }, [theme]);

  useEffect(() => {
    if (currentUserId) {
      window.localStorage.setItem("ticketly.currentUserId", currentUserId);
      return;
    }
    window.localStorage.removeItem("ticketly.currentUserId");
  }, [currentUserId]);

  const visibleTickets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return sortByUpdatedAt(
      tickets.filter((ticketItem) => {
        const visible = canViewTicket(ticketItem, currentUser);
        const statusMatches = statusFilter === "all" || ticketItem.status === statusFilter;
        const textMatches =
          !normalizedSearch ||
          ticketItem.title.toLowerCase().includes(normalizedSearch) ||
          ticketItem.description.toLowerCase().includes(normalizedSearch);
        return visible && statusMatches && textMatches;
      })
    );
  }, [currentUser, search, statusFilter, tickets]);

  const activeTicket = byId(visibleTickets, activeTicketId) ?? visibleTickets[0] ?? null;

  useEffect(() => {
    if (activeTicket && activeTicket.id !== activeTicketId) {
      dispatch(setActiveTicket(activeTicket.id));
    }
  }, [activeTicket, activeTicketId, dispatch]);

  if (loading) {
    return (
      <main className={`${theme} shell grid place-items-center`}>
        <div className="panel flex items-center gap-3 px-5 py-4">
          <Clock3 className="h-5 w-5 text-brand" />
          <span className="text-sm font-semibold">Loading ticket workspace</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`${theme} shell grid place-items-center`}>
        <div className="panel max-w-lg px-5 py-4">
          <p className="font-semibold text-danger">Could not start Ticketly</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <LoginPage
        employees={employees}
        theme={theme}
        onLogin={(employeeId) => dispatch(login(employeeId))}
      />
    );
  }

  const canManageAdmin = canManage(currentUser);

  function renderPage() {
    if (activePage === "new-ticket") {
      return (
        <NewTicketPage
          departments={departments}
          teams={teams}
          onCreate={(payload) => dispatch(createTicket(payload))}
        />
      );
    }

    if (activePage === "tickets") {
      return (
        <TicketsPage
          activeTicket={activeTicket}
          activeTicketId={activeTicket?.id}
          attachments={attachments}
          currentUser={currentUser}
          departments={departments}
          employees={employees}
          messages={messages}
          search={search}
          statusFilter={statusFilter}
          teams={teams}
          tickets={visibleTickets}
          onAssign={(payload) => dispatch(assignTicket(payload))}
          onMessage={(payload) => dispatch(sendMessage(payload))}
          onSearch={(value) => dispatch(setSearch(value))}
          onSelect={(ticketId) => dispatch(setActiveTicket(ticketId))}
          onStatus={(payload) => dispatch(updateTicketStatus(payload))}
          onStatusFilter={(value) => dispatch(setStatusFilter(value))}
          onTransfer={(payload) => dispatch(transferTicket(payload))}
        />
      );
    }

    if (activePage === "admin" && canManageAdmin) {
      return (
        <AdminPage
          currentUser={currentUser}
          departments={departments}
          employees={employees}
          teams={teams}
          onCreateDepartment={(payload) => dispatch(createDepartment(payload))}
          onCreateEmployee={(payload) => dispatch(createEmployee(payload))}
          onCreateTeam={(payload) => dispatch(createTeam(payload))}
        />
      );
    }

    if (activePage === "settings") {
      return (
        <SettingsPage
          currentUser={currentUser}
          theme={theme}
          onThemeChange={(value) => dispatch(setTheme(value))}
        />
      );
    }

    return (
      <DashboardPage
        departments={departments}
        employees={employees}
        teams={teams}
        tickets={visibleTickets}
      />
    );
  }

  return (
    <main className={`${theme} shell`}>
      <div className="flex w-full flex-col gap-5">
        <TopBar
          activePage={activePage}
          canManageAdmin={canManageAdmin}
          currentUser={currentUser}
          onLogout={() => dispatch(logout())}
          onNavigate={(page) => dispatch(setActivePage(page))}
        />
        {renderPage()}
      </div>
    </main>
  );
}
