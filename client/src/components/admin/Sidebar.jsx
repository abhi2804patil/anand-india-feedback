import { useTheme } from '../../lib/theme.jsx';
import { Brand } from '../Brand.jsx';
import { LayoutDashboard, Table2, LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ view, setView }) {
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  function logout() {
    localStorage.removeItem('aibh_token');
    nav('/admin/login');
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
        <button onClick={logout} className="btn-ghost w-full justify-start">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
