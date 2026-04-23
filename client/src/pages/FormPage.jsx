import { Link } from 'react-router-dom';
import { Brand } from '../components/Brand.jsx';
import FeedbackForm from '../components/form/FeedbackForm.jsx';

export default function FormPage() {
  return (
    <div className="min-h-full">
      <header className="gradient-header text-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/"><Brand light /></Link>
          <span className="text-xs opacity-70">Tenant Feedback Form</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <FeedbackForm />
      </main>
    </div>
  );
}
