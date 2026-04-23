import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import {
  loadDatabase,
  putMany,
  putRecord,
  seedDatabaseIfNeeded
} from "../lib/db.js";

const nowIso = () => new Date().toISOString();

function readStorage(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }
  return window.localStorage.getItem(key) ?? fallback;
}

const initialState = {
  loading: true,
  error: null,
  currentUserId: readStorage("ticketly.currentUserId", ""),
  theme: readStorage("ticketly.theme", "theme-light"),
  activePage: "dashboard",
  activeTicketId: null,
  statusFilter: "all",
  search: "",
  departments: [],
  teams: [],
  employees: [],
  tickets: [],
  messages: [],
  attachments: []
};

function calculateDueAt(department, priority) {
  const priorityMultiplier = {
    low: 1.5,
    medium: 1,
    high: 0.75,
    critical: 0.5
  };
  const baseHours = department?.slaHours ?? 24;
  const hours = baseHours * (priorityMultiplier[priority] ?? 1);
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function ticketEvent(type, actorId, message) {
  return {
    id: nanoid(),
    type,
    actorId,
    message,
    createdAt: nowIso()
  };
}

function systemMessage(ticketId, authorId, body) {
  return {
    id: nanoid(),
    ticketId,
    authorId,
    type: "system",
    body,
    attachmentIds: [],
    createdAt: nowIso()
  };
}

export const bootstrapApp = createAsyncThunk("ticketly/bootstrap", async () => {
  await seedDatabaseIfNeeded();
  return loadDatabase();
});

export const createTicket = createAsyncThunk(
  "ticketly/createTicket",
  async (payload, { getState }) => {
    const state = getState().ticketly;
    const user = state.employees.find((employee) => employee.id === state.currentUserId);
    if (!user) {
      throw new Error("A signed-in user is required to create a ticket.");
    }
    const department = state.departments.find(
      (item) => item.id === payload.departmentId
    );
    const team =
      state.teams.find((item) => item.id === payload.teamId) ??
      state.teams.find((item) => item.departmentId === payload.departmentId);

    const timestamp = nowIso();
    const messageId = nanoid();
    const normalizedAttachments = (payload.attachments ?? []).map((attachment) => ({
      ...attachment,
      id: nanoid(),
      ticketId: "",
      messageId,
      uploadedById: user.id,
      createdAt: timestamp
    }));
    const ticket = {
      id: nanoid(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      status: "open",
      priority: payload.priority,
      departmentId: payload.departmentId,
      teamId: team?.id ?? "",
      createdById: user.id,
      assigneeId: "",
      dueAt: calculateDueAt(department, payload.priority),
      resolvedAt: null,
      transfers: [],
      history: [
        ticketEvent(
          "created",
          user.id,
          `Ticket created for ${department?.name ?? "a department"}.`
        )
      ],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const ticketAttachments = normalizedAttachments.map((attachment) => ({
      ...attachment,
      ticketId: ticket.id
    }));
    const message = {
      id: messageId,
      ticketId: ticket.id,
      authorId: user.id,
      type: "system",
      body: `Ticket opened by ${user.name}.`,
      attachmentIds: ticketAttachments.map((attachment) => attachment.id),
      createdAt: timestamp
    };

    await Promise.all([
      putRecord("tickets", ticket),
      putRecord("messages", message),
      putMany("attachments", ticketAttachments)
    ]);
    return { ticket, message, attachments: ticketAttachments };
  }
);

export const sendMessage = createAsyncThunk(
  "ticketly/sendMessage",
  async ({ ticketId, body, attachments }, { getState }) => {
    const state = getState().ticketly;
    const user = state.employees.find((employee) => employee.id === state.currentUserId);
    const ticket = state.tickets.find((item) => item.id === ticketId);
    const timestamp = nowIso();
    const messageId = nanoid();
    const normalizedAttachments = attachments.map((attachment) => ({
      ...attachment,
      id: nanoid(),
      ticketId,
      messageId,
      uploadedById: user.id,
      createdAt: timestamp
    }));
    const message = {
      id: messageId,
      ticketId,
      authorId: user.id,
      type: "user",
      body: body.trim(),
      attachmentIds: normalizedAttachments.map((attachment) => attachment.id),
      createdAt: timestamp
    };
    const updatedTicket = { ...ticket, updatedAt: timestamp };

    await Promise.all([
      putRecord("tickets", updatedTicket),
      putRecord("messages", message),
      putMany("attachments", normalizedAttachments)
    ]);

    return { ticket: updatedTicket, message, attachments: normalizedAttachments };
  }
);

export const transferTicket = createAsyncThunk(
  "ticketly/transferTicket",
  async ({ ticketId, toDepartmentId, toTeamId, reason }, { getState }) => {
    const state = getState().ticketly;
    const ticket = state.tickets.find((item) => item.id === ticketId);
    const user = state.employees.find((employee) => employee.id === state.currentUserId);
    const fromDepartment = state.departments.find(
      (department) => department.id === ticket.departmentId
    );
    const toDepartment = state.departments.find(
      (department) => department.id === toDepartmentId
    );
    const timestamp = nowIso();
    const reasonText = reason.trim() || "No reason provided.";
    const transfer = {
      id: nanoid(),
      fromDepartmentId: ticket.departmentId,
      fromTeamId: ticket.teamId,
      toDepartmentId,
      toTeamId,
      transferredById: user.id,
      reason: reasonText,
      createdAt: timestamp
    };
    const messageBody = `Transferred from ${fromDepartment?.name ?? "previous department"} to ${toDepartment?.name ?? "new department"}. Reason: ${reasonText}`;
    const updatedTicket = {
      ...ticket,
      departmentId: toDepartmentId,
      teamId: toTeamId,
      assigneeId: "",
      status: "transferred",
      transfers: [...ticket.transfers, transfer],
      history: [...ticket.history, ticketEvent("transferred", user.id, messageBody)],
      updatedAt: timestamp
    };
    const message = systemMessage(ticketId, user.id, messageBody);

    await Promise.all([putRecord("tickets", updatedTicket), putRecord("messages", message)]);
    return { ticket: updatedTicket, message };
  }
);

export const assignTicket = createAsyncThunk(
  "ticketly/assignTicket",
  async ({ ticketId, assigneeId, teamId }, { getState }) => {
    const state = getState().ticketly;
    const ticket = state.tickets.find((item) => item.id === ticketId);
    const user = state.employees.find((employee) => employee.id === state.currentUserId);
    const assignee = state.employees.find((employee) => employee.id === assigneeId);
    const timestamp = nowIso();
    const updatedTicket = {
      ...ticket,
      assigneeId,
      teamId: teamId || ticket.teamId,
      status:
        ticket.status === "open" || ticket.status === "transferred"
          ? "in_progress"
          : ticket.status,
      history: [
        ...ticket.history,
        ticketEvent("assigned", user.id, `Assigned to ${assignee?.name ?? "an employee"}.`)
      ],
      updatedAt: timestamp
    };
    const message = systemMessage(
      ticketId,
      user.id,
      `Assigned to ${assignee?.name ?? "an employee"}.`
    );

    await Promise.all([putRecord("tickets", updatedTicket), putRecord("messages", message)]);
    return { ticket: updatedTicket, message };
  }
);

export const updateTicketStatus = createAsyncThunk(
  "ticketly/updateTicketStatus",
  async ({ ticketId, status }, { getState }) => {
    const state = getState().ticketly;
    const ticket = state.tickets.find((item) => item.id === ticketId);
    const user = state.employees.find((employee) => employee.id === state.currentUserId);
    const timestamp = nowIso();
    const statusText = status.replaceAll("_", " ");
    const updatedTicket = {
      ...ticket,
      status,
      resolvedAt: status === "resolved" ? timestamp : ticket.resolvedAt,
      history: [
        ...ticket.history,
        ticketEvent("status_changed", user.id, `Status changed to ${statusText}.`)
      ],
      updatedAt: timestamp
    };
    const message = systemMessage(ticketId, user.id, `Status changed to ${statusText}.`);

    await Promise.all([putRecord("tickets", updatedTicket), putRecord("messages", message)]);
    return { ticket: updatedTicket, message };
  }
);

export const createDepartment = createAsyncThunk(
  "ticketly/createDepartment",
  async ({ name, description, slaHours, headId }) => {
    const timestamp = nowIso();
    const department = {
      id: nanoid(),
      name: name.trim(),
      description: description.trim(),
      headId,
      slaHours: Number(slaHours) || 24,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    await putRecord("departments", department);
    return department;
  }
);

export const createTeam = createAsyncThunk(
  "ticketly/createTeam",
  async ({ departmentId, name, leaderId }) => {
    const timestamp = nowIso();
    const team = {
      id: nanoid(),
      departmentId,
      name: name.trim(),
      leaderId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    await putRecord("teams", team);
    return team;
  }
);

export const createEmployee = createAsyncThunk(
  "ticketly/createEmployee",
  async ({ name, email, role, departmentId, teamId }) => {
    const timestamp = nowIso();
    const employee = {
      id: nanoid(),
      name: name.trim(),
      email: email.trim(),
      role,
      departmentId,
      teamId,
      active: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    await putRecord("employees", employee);
    return employee;
  }
);

const ticketSlice = createSlice({
  name: "ticketly",
  initialState,
  reducers: {
    login(state, action) {
      state.currentUserId = action.payload;
      state.activePage = "dashboard";
      state.activeTicketId = null;
    },
    logout(state) {
      state.currentUserId = "";
      state.activePage = "dashboard";
      state.activeTicketId = null;
    },
    setCurrentUser(state, action) {
      state.currentUserId = action.payload;
      state.activeTicketId = null;
    },
    setActivePage(state, action) {
      state.activePage = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setActiveTicket(state, action) {
      state.activeTicketId = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bootstrapApp.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.activeTicketId = action.payload.tickets[0]?.id ?? null;
        state.loading = false;
      })
      .addCase(bootstrapApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unable to load IndexedDB.";
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload.ticket);
        state.messages.push(action.payload.message);
        state.attachments.push(...action.payload.attachments);
        state.activeTicketId = action.payload.ticket.id;
        state.activePage = "tickets";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.tickets = state.tickets.map((ticket) =>
          ticket.id === action.payload.ticket.id ? action.payload.ticket : ticket
        );
        state.messages.push(action.payload.message);
        state.attachments.push(...action.payload.attachments);
      })
      .addCase(transferTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.map((ticket) =>
          ticket.id === action.payload.ticket.id ? action.payload.ticket : ticket
        );
        state.messages.push(action.payload.message);
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.map((ticket) =>
          ticket.id === action.payload.ticket.id ? action.payload.ticket : ticket
        );
        state.messages.push(action.payload.message);
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.tickets = state.tickets.map((ticket) =>
          ticket.id === action.payload.ticket.id ? action.payload.ticket : ticket
        );
        state.messages.push(action.payload.message);
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      });
  }
});

export const {
  login,
  logout,
  setActivePage,
  setActiveTicket,
  setCurrentUser,
  setSearch,
  setStatusFilter,
  setTheme
} = ticketSlice.actions;

export default ticketSlice.reducer;
