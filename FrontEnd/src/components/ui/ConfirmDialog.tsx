import { Dialog } from "./Dialog";

type ConfirmDialogProps = {
  title: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  title,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog onClose={onCancel}>
      <section className="logout-dialog">
        <h2>{title}</h2>
        <div className="logout-dialog-actions">
          <button className="dialog-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="dialog-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </Dialog>
  );
}
