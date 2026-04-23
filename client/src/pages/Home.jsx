import { Link } from 'react-router-dom';
import { Brand } from '../components/Brand.jsx';
import { ArrowRight, ShieldCheck, BarChart3, MessageSquareHeart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="gradient-header text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Brand light />
          <Link to="/admin/login" className="text-sm opacity-80 hover:opacity-100">
            Admin Login
          </Link>
        </div>
      </header>

      <section className="gradient-header text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <span className="inline-block text-gold-500 text-xs font-semibold tracking-widest uppercase">
              Tenant Feedback Portal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">
              Help us build a <span className="text-gold-500">better workspace</span> for your business.
            </h1>
            <p className="mt-5 text-white/75 text-lg max-w-2xl">
              Your feedback shapes the space we share. Share your experience in a short, guided form —
              every response is reviewed by the management team.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link to="/feedback" className="btn-gold">
                Start Feedback <ArrowRight size={18} />
              </Link>
              <Link to="/admin/login" className="btn-ghost text-white border-white/30 hover:bg-white/10">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-5">
        {[
          { icon: MessageSquareHeart, title: '13 focused sections', text: 'Quick-to-complete guided wizard covering every aspect of your tenancy.' },
          { icon: ShieldCheck, title: 'Private & secure', text: 'Only the management team reviews feedback — kept confidential.' },
          { icon: BarChart3, title: 'Drives real change', text: 'We track trends and close the loop on recurring concerns.' },
        ].map((f) => (
          <div key={f.title} className="card">
            <div className="h-10 w-10 rounded-xl bg-gold-500/15 text-gold-500 flex items-center justify-center">
              <f.icon size={20} />
            </div>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="text-sm opacity-70 mt-1">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto text-center text-xs opacity-60 py-6">
        © {new Date().getFullYear()} Anand India Business Hub
      </footer>
    </div>
  );
}
