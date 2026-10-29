/**
 * ColorFly: In-Webview Dialog Components
 * Native confirm/prompt/alert are disabled inside VS Code webviews, so all
 * destructive actions and text prompts are served by these accessible dialogs.
 */

import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cf-confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="cf-confirm-dialog-title" style={{ margin: 0, fontSize: 14, color: 'var(--cf-title-fg)' }}>
            {title}
          </h3>
          <button className="btn btn-outline btn-sm" onClick={onCancel} aria-label="Close dialog">
            <CloseIcon size={12} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--cf-fg)' }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

interface PromptDialogProps {
  title: string;
  message?: string;
  initialValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export const PromptDialog: React.FC<PromptDialogProps> = ({
  title,
  message,
  initialValue = '',
  placeholder,
  confirmLabel = 'Save',
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  const canSubmit = value.trim().length > 0;

  const submit = () => {
    if (canSubmit) {
      onConfirm(value.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cf-prompt-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="cf-prompt-dialog-title" style={{ margin: 0, fontSize: 14, color: 'var(--cf-title-fg)' }}>
            {title}
          </h3>
          <button className="btn btn-outline btn-sm" onClick={onCancel} aria-label="Close dialog">
            <CloseIcon size={12} />
          </button>
        </div>
        <div className="modal-body">
          {message && (
            <p style={{ margin: '0 0 10px 0', fontSize: 12, color: 'var(--cf-desc-fg)' }}>{message}</p>
          )}
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            style={{ width: '100%' }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={!canSubmit}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
