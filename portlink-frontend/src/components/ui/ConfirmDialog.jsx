import React from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-4">
        {description && <p className="text-sm text-slate-600">{description}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
