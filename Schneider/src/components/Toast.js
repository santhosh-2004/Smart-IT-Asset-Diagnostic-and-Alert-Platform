import React, { useEffect } from 'react';

const icons = {
  warning: (
    <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
  ),
  critical: (
    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
  )
};

const bgColors = {
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-900',
  critical: 'bg-red-100 border-red-500 text-red-900',
};

export default function Toast({ id, type = 'warning', message, onClose, duration = 6000, action }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`flex items-center shadow-lg rounded-lg border-l-4 px-4 py-3 mb-3 animate-toast-in ${bgColors[type]}`}
      style={{ minWidth: 320, maxWidth: 400 }}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 text-sm font-medium">{message}</div>
      {action && (
        <button
          className="ml-4 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
      <button
        className="ml-2 text-lg font-bold text-gray-500 hover:text-gray-800 focus:outline-none"
        onClick={() => onClose(id)}
        title="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// Add animation
// In your global CSS (e.g., index.css):
// .animate-toast-in { animation: toast-in 0.4s cubic-bezier(0.4,0,0.2,1); }
// @keyframes toast-in { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } } 