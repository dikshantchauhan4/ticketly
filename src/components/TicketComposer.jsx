import { useEffect, useState } from "react";
import { Paperclip, Plus, Ticket } from "lucide-react";
import { priorityLabels } from "../lib/constants.js";
import { filesToAttachments } from "../lib/ticketUtils.js";

export function TicketComposer({ departments, onCreate, teams }) {
  const firstDepartmentId = departments[0]?.id ?? "";
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    departmentId: firstDepartmentId,
    teamId: ""
  });
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [isReadingFiles, setIsReadingFiles] = useState(false);

  useEffect(() => {
    if (!form.departmentId && firstDepartmentId) {
      setForm((current) => ({ ...current, departmentId: firstDepartmentId }));
    }
  }, [firstDepartmentId, form.departmentId]);

  const departmentTeams = teams.filter((team) => team.departmentId === form.departmentId);

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "departmentId" ? { teamId: "" } : {})
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.departmentId) {
      return;
    }
    onCreate({
      ...form,
      teamId: form.teamId || departmentTeams[0]?.id || "",
      attachments: pendingAttachments
    });
    setForm((current) => ({
      ...current,
      title: "",
      description: ""
    }));
    setPendingAttachments([]);
  }

  async function handleFiles(event) {
    setIsReadingFiles(true);
    const records = await filesToAttachments(event.target.files);
    setPendingAttachments((current) => [...current, ...records]);
    setIsReadingFiles(false);
    event.target.value = "";
  }

  function removePendingAttachment(name) {
    setPendingAttachments((current) =>
      current.filter((attachment) => attachment.name !== name)
    );
  }

  return (
    <form className="panel grid gap-3 p-4" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-brand" />
        <h2 className="text-base font-bold">Raise ticket</h2>
      </div>
      <label className="grid gap-1">
        <span className="label">Problem title</span>
        <input
          className="input"
          value={form.title}
          maxLength={180}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Short clear title"
        />
      </label>
      <label className="grid gap-1">
        <span className="label">Description</span>
        <textarea
          className="input min-h-24 resize-y"
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="Describe the issue, impact, location, and relevant IDs"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="label">Department</span>
          <select
            className="input"
            value={form.departmentId}
            onChange={(event) => update("departmentId", event.target.value)}
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="label">Team</span>
          <select
            className="input"
            value={form.teamId}
            onChange={(event) => update("teamId", event.target.value)}
          >
            <option value="">Auto route</option>
            {departmentTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-1">
        <span className="label">Priority</span>
        <select
          className="input"
          value={form.priority}
          onChange={(event) => update("priority", event.target.value)}
        >
          {Object.entries(priorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-2">
        <span className="label">Images</span>
        {pendingAttachments.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {pendingAttachments.map((attachment) => (
              <div
                key={attachment.name}
                className="flex items-center gap-2 border border-line bg-surface p-2"
                style={{ borderRadius: 6 }}
              >
                <img
                  alt={attachment.name}
                  className="h-12 w-12 object-cover"
                  src={attachment.dataUrl}
                  style={{ borderRadius: 4 }}
                />
                <span className="min-w-0 flex-1 truncate text-xs">{attachment.name}</span>
                <button
                  className="text-xs font-semibold text-danger"
                  type="button"
                  onClick={() => removePendingAttachment(attachment.name)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="btn btn-secondary cursor-pointer">
          <Paperclip className="h-4 w-4" />
          {isReadingFiles ? "Reading images" : "Attach images"}
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
          />
        </label>
      </div>
      <button className="btn btn-primary" type="submit">
        <Ticket className="h-4 w-4" />
        Create ticket
      </button>
    </form>
  );
}
