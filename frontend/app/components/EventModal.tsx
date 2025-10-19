interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: {
    title: string;
    type: string;
    description?: string;
    start: Date;
    end: Date;
    strictness?: boolean;
  };
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--color-a)] rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-2xl font-bold text-[var(--color-e)]">{event.title}</h3>
        <p className="text-sm text-[var(--color-c)] font-medium">
          Type: <span className="font-semibold">{event.type}</span>
        </p>
        <p className="text-sm text-[var(--color-c)] font-medium">
          Start: <span className="font-semibold">{event.start.toLocaleString()}</span>
        </p>
        <p className="text-sm text-[var(--color-c)] font-medium">
          End: <span className="font-semibold">{event.end.toLocaleString()}</span>
        </p>
        {event.description && (
          <p className="text-sm text-[var(--color-c)]">{event.description}</p>
        )}
        {event.strictness !== undefined && (
          <p className="text-sm text-[var(--color-c)]">
            Strictness: {event.strictness ? "Strict" : "Flexible"}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-[var(--color-d)] text-[var(--color-a)] rounded-lg hover:bg-[var(--color-e)] transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}