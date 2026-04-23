import { useState } from 'react';
import { useTheme } from '../../lib/theme.jsx';
import { Brand } from '../Brand.jsx';
import { LayoutDashboard, Table2, LogOut, Moon, Sun, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function Sidebar({ view, setView, onCleared }) {
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [showClearModal, setShowClearModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState('');

  function logout() {
    localStorage.removeItem('aibh_token');
    nav('/admin/login');
  }

  async function handleClear() {
    setClearError('');
    setClearing(true);
    try {
      await api.clearAllResponses();
      setShowClearModal(false);
      setConfirmText('');
      if (onCleared) onCleared();
    } catch (e) {
      setClearError(e.message || 'Could not clear');
    } finally {
      setClearing(false);
    }
  }

  const items = [
    { key: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { key: 'responses', icon: Table2, label: 'Responses' },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white dark:bg-navy-700 border-r border-navy-100 dark:border-navy-500">
      <div className="px-5 py-5 border-b border-navy-100 dark:border-navy-500">
        <Brand compact />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active = view === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${active ? 'bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-900' : 'hover:bg-navy-50 dark:hover:bg-navy-500'}`}
            >
              <it.icon size={18} />
              {it.label}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-navy-100 dark:border-navy-500 space-y-2">
        <button onClick={toggle} className="btn-ghost w-full justify-start">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <button
          onClick={() => setShowClearModal(true)}
          className="w-full inline-flex items-center gap-2 rounded-xl border border-red-200 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 transition dark:border-red-500/40 dark:hover:bg-red-500/10"
        >
          <Trash2 size={16} /> Clear all data
        </button>
        <button onClick={logout} className="btn-ghost w-full justify-start">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {showClearModal && (
        <div
          className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !clearing && setShowClearModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-navy-700 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/15 text-red-600 flex items-center justify-center">
                <Trash2 size={18} />
              </div>
              <h2 className="text-lg font-bold">Clear all feedback?</h2>
            </div>
            <p className="text-sm opacity-75 mb-4">
              This will permanently delete <strong>every</strong> feedback submission
              (demo data and real responses). This cannot be undone.
            </p>
            <p className="text-sm mb-2">Type <code className="px-1.5 py-0.5 rounded bg-navy-50 dark:bg-navy-900 font-mono">CLEAR</code> to confirm:</p>
            <input
              className="input mb-4"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type CLEAR"
              autoFocus
            />
            {clearError && <div className="text-sm text-red-600 mb-3">{clearError}</div>}
            <div className="flex gap-2 justify-end">
              <button
                className="btn-ghost"
                disabled={clearing}
                onClick={() => { setShowClearModal(false); setConfirmText(''); setClearError(''); }}
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                disabled={confirmText !== 'CLEAR' || clearing}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-5 py-2.5 font-semibold shadow-card hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clearing ? 'Clearing…' : 'Delete everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
