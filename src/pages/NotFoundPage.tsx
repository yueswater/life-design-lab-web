import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/strings';

const REDIRECT_SECONDS = 5;

export default function NotFoundPage() {
  const navigate = useNavigate();
  const t = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    document.title = `${t.notFound.title} | ${t.footer.brandName}`;
  }, [t.notFound.title, t.footer.brandName]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate('/', { replace: true });
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, navigate]);

  return (
    <section className="flex w-full flex-col items-center justify-center px-4 py-32 text-center sm:px-8 sm:py-40">
      <p className="font-huninn text-7xl font-black tracking-tight text-[#023047] sm:text-8xl">404</p>
      <h1 className="mt-4 font-huninn text-xl font-black text-[#023047] sm:text-2xl">
        {t.notFound.title}
      </h1>
      <p className="mt-2 max-w-sm text-sm font-medium text-slate-500">{t.notFound.message}</p>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[#023047]/50">
        {t.notFound.redirecting(secondsLeft)}
      </p>
    </section>
  );
}
