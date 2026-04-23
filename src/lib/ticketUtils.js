export function byId(items, id) {
  return items.find((item) => item.id === id);
}

export function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatDuration(ms) {
  const abs = Math.abs(ms);
  const hours = Math.floor(abs / 36e5);
  const minutes = Math.round((abs % 36e5) / 6e4);
  if (hours <= 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

export function getTat(ticket) {
  if (!ticket) {
    return { label: "Not set", tone: "text-muted" };
  }

  const due = new Date(ticket.dueAt).getTime();
  const end = ticket.resolvedAt ? new Date(ticket.resolvedAt).getTime() : Date.now();
  const delta = due - end;

  if (ticket.resolvedAt) {
    return delta >= 0
      ? { label: `Resolved ${formatDuration(delta)} early`, tone: "text-accent" }
      : { label: `Resolved ${formatDuration(delta)} late`, tone: "text-danger" };
  }

  if (delta < 0) {
    return { label: `Breached by ${formatDuration(delta)}`, tone: "text-danger" };
  }

  if (delta < 4 * 60 * 60 * 1000) {
    return { label: `Due in ${formatDuration(delta)}`, tone: "text-brand" };
  }

  return { label: `${formatDuration(delta)} left`, tone: "text-accent" };
}

export function canViewTicket(ticket, user) {
  if (!user) {
    return false;
  }
  if (user.role === "super_user") {
    return true;
  }
  if (user.role === "department_head") {
    return ticket.departmentId === user.departmentId;
  }
  if (user.role === "team_leader") {
    return (
      ticket.teamId === user.teamId ||
      ticket.createdById === user.id ||
      ticket.assigneeId === user.id
    );
  }
  return ticket.createdById === user.id || ticket.assigneeId === user.id;
}

export function canManage(user) {
  return ["super_user", "department_head", "team_leader"].includes(user?.role);
}

export function canCreateDepartment(user) {
  return user?.role === "super_user";
}

export function canManageDepartment(user, departmentId) {
  return user?.role === "super_user" || user?.departmentId === departmentId;
}

export function sortByUpdatedAt(tickets) {
  return [...tickets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function filesToAttachments(files) {
  const images = [...files].filter((file) => file.type.startsWith("image/"));
  return Promise.all(
    images.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: reader.result
            });
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        })
    )
  );
}
