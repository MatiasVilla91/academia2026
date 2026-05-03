import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  function reject() {
    localStorage.setItem('cookie-consent', 'rejected');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#140D28] border-t border-[#7C3AED]/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-gray-400 text-sm flex-1">
          Usamos cookies para analizar el tráfico y mejorar tu experiencia. Consultá nuestra{' '}
          <Link to="/politica-cookies" className="text-[#D4AF37] hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded hover:bg-white/5 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
