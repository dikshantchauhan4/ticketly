import { useState } from "react";
import { MessageSquare, Paperclip, Send } from "lucide-react";
import { byId, filesToAttachments, formatDate } from "../lib/ticketUtils.js";

export function ChatPanel({ attachments, currentUser, employees, messages, onSend }) {
  const [body, setBody] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [isReadingFiles, setIsReadingFiles] = useState(false);

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

  function handleSubmit(event) {
    event.preventDefault();
    if (!body.trim() && pendingAttachments.length === 0) {
      return;
    }
    onSend({ body, attachments: pendingAttachments });
    setBody("");
    setPendingAttachments([]);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-brand" />
        <h3 className="font-bold">Ticket chat</h3>
      </div>
      <div className="grid max-h-[560px] gap-3 overflow-y-auto pr-1">
        {messages.map((message) => {
          const author = byId(employees, message.authorId);
          const isSystem = message.type === "system";
          const isOutgoing = !isSystem && message.authorId === currentUser.id;
          const messageAttachments = attachments.filter((attachment) =>
            message.attachmentIds.includes(attachment.id)
          );
          return (
            <div
              key={message.id}
              className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
            >
              <article
                className={`max-w-[86%] border p-3 shadow-sm sm:max-w-[68%] ${
                  isSystem
                    ? "rounded-[14px] rounded-bl-sm border-line bg-elevated"
                    : isOutgoing
                      ? "rounded-[14px] rounded-br-sm border-brand/40 bg-brand text-brandInk"
                      : "rounded-[14px] rounded-bl-sm border-line bg-surface"
                }`}
              >
                <div
                  className={`flex flex-wrap items-center gap-2 ${
                    isOutgoing ? "justify-end" : "justify-between"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {isSystem ? "System update" : author?.name ?? "Unknown"}
                  </p>
                  <time className={`text-xs ${isOutgoing ? "text-brandInk/75" : "text-muted"}`}>
                    {formatDate(message.createdAt)}
                  </time>
                </div>
                {message.body && (
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm">{message.body}</p>
                )}
                {messageAttachments.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {messageAttachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        className="block overflow-hidden border border-line bg-surface text-ink"
                        href={attachment.dataUrl}
                        download={attachment.name}
                        style={{ borderRadius: 8 }}
                      >
                        <img
                          alt={attachment.name}
                          className="h-32 w-full object-cover"
                          src={attachment.dataUrl}
                        />
                        <span className="block truncate px-2 py-1 text-xs text-muted">
                          {attachment.name}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </div>
          );
        })}
      </div>
      <form className="subtle-panel grid gap-3 p-3" onSubmit={handleSubmit}>
        <textarea
          className="input min-h-20 resize-y"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ask a question or add an update"
        />
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
                  className="h-10 w-10 object-cover"
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
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          <button className="btn btn-primary" type="submit">
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
