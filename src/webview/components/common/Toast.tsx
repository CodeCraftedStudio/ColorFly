/**
 * ColorFly: Toast Notification System
 * Lightweight, auto-dismissing toast alerts for user feedback across the studio.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const TYPE_CONFIG: Record<ToastType, { bg: string; color: string; border: string; icon: string }> = {
  success: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '#34d399', icon: '✓' },
  error:   { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '#f87171', icon: '✕' },
  info:    { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '#60a5fa', icon: 'ℹ' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '#fbbf24', icon: '⚠' },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 8,
            background: TYPE_CONFIG[toast.type].bg,
            border: `1px solid ${TYPE_CONFIG[toast.type].border}`,
            color: TYPE_CONFIG[toast.type].color,
            minWidth: 280,
            maxWidth: 400,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            fontSize: 13,
            fontWeight: 500,
            animation: 'slideIn 0.25s ease-out',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>{TYPE_CONFIG[toast.type].icon}</span>
          <span style={{ flex: 1, minWidth: 0 }}>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: TYPE_CONFIG[toast.type].color,
              cursor: 'pointer',
              padding: 2,
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const success = useCallback((message: string, duration?: number) => show('success', message, duration), [show]);
  const error = useCallback((message: string, duration?: number) => show('error', message, duration), [show]);
  const info = useCallback((message: string, duration?: number) => show('info', message, duration), [show]);
  const warning = useCallback((message: string, duration?: number) => show('warning', message, duration), [show]);

  return { toasts, dismiss, show, success, error, info, warning };
};