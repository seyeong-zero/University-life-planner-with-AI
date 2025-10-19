interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: {
    id: string;       // include id so you know which event to delete
    title: string;
    type: string;
    description?: string;
    start: Date;
    end: Date;
    strictness?: boolean;
  };
  onDelete?: (id: string) => void; // callback for deleting
}

export default function EventModal({ isOpen, onClose, event, onDelete }: EventModalProps) {
  if (!isOpen || !event) return null;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(event.id);
    }
    onClose(); // close modal after deletion
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-2xl font-bold text-[var(--color-e)]">{event.title}</h3>

        <p className="text-sm text-[var(--color-c)] font-medium">
          {event.start.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}{" "}
          {event.start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} -{" "}
          {event.end.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}{" "}
          {event.end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </p>

        {event.description && <p className="text-sm text-[var(--color-c)]">{event.description}</p>}
        {event.strictness !== undefined && (
          <p className="text-sm text-[var(--color-c)]">
            Strictness: {event.strictness ? "Strict" : "Flexible"}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
}