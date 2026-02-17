import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../App';
import { DashboardIcon, UserIcon } from '../components/icons';

interface LoginPageProps {
  setPage: (page: Page) => void;
}

const quickAccounts = {
  admin: {
    email: 'admin@reptilehouse.sy',
    pass: 'admin123',
    label: 'دخول سريع كمسؤول',
  },
  user: {
    email: 'user@reptilehouse.sy',
    pass: 'user123',
    label: 'دخول سريع كمستخدم',
  },
} as const;

const LoginPage: React.FC<LoginPageProps> = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const routeAfterLogin = (role: string) => {
    if (role === 'admin' || role === 'manager') {
      setPage('dashboard');
      return;
    }
    setPage('home');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const authenticatedUser = await login(email, password);
    setIsSubmitting(false);

    if (!authenticatedUser) {
      setError('البريد الإلكتروني غير مسجل أو كلمة المرور غير صحيحة');
      return;
    }

    routeAfterLogin(authenticatedUser.role);
  };

  const handleQuickLogin = async (role: 'admin' | 'user') => {
    const credentials = quickAccounts[role];
    setEmail(credentials.email);
    setPassword(credentials.pass);
    setError('');
    setIsSubmitting(true);

    const authenticatedUser = await login(credentials.email, credentials.pass);
    setIsSubmitting(false);

    if (!authenticatedUser) {
      setError('تعذر تسجيل الدخول السريع. تأكد من تشغيل الباك اند وتنفيذ seeding للحسابات.');
      return;
    }

    routeAfterLogin(authenticatedUser.role);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg animate-scale-in">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">تسجيل الدخول</h2>
          <p className="text-gray-400 text-sm">أهلًا بك مجددًا في بيت الزواحف</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-black text-amber-400 uppercase tracking-wider mb-2 ms-1">البريد الإلكتروني</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-right"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 ms-1">
              <label htmlFor="password" className="block text-xs font-black text-amber-400 uppercase tracking-wider">كلمة المرور</label>
              <a href="#" onClick={(e) => { e.preventDefault(); setPage('forgotPassword'); }} className="text-xs text-amber-500 hover:text-amber-400 hover:underline">نسيت كلمة المرور؟</a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-right"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 text-gray-900 font-black py-4 rounded-xl hover:bg-amber-400 transition-all duration-300 transform hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري تسجيل الدخول...' : 'دخول للموقع'}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 space-y-3 text-right">
          <p className="text-xs text-gray-400 font-bold">تسجيل سريع للتجربة:</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-black py-3 rounded-xl hover:bg-indigo-500/30 transition-all group text-xs disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <DashboardIcon className="w-4 h-4" />
              <span>{quickAccounts.admin.label}</span>
            </button>
            <button
              onClick={() => handleQuickLogin('user')}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/40 text-green-300 font-black py-3 rounded-xl hover:bg-green-500/30 transition-all group text-xs disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <UserIcon className="w-4 h-4" />
              <span>{quickAccounts.user.label}</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            المسؤول: <span className="text-gray-300">admin@reptilehouse.sy / admin123</span><br />
            المستخدم: <span className="text-gray-300">user@reptilehouse.sy / user123</span>
          </p>
        </div>

        <p className="text-center text-gray-400 text-sm">
          ليس لديك حساب؟{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setPage('register'); }} className="font-bold text-amber-500 hover:text-amber-400 underline underline-offset-4">
            أنشئ حسابًا جديدًا
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
