import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  function handleRevoke() {
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  }

  return (
    <>
      <Helmet>
        <title>Política de Cookies — Academia Astral</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="text-[#D4AF37] text-sm hover:underline mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="font-display text-3xl text-[#D4AF37] mb-2">Política de Cookies</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: mayo de 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que un sitio web almacena en tu dispositivo cuando lo visitás. Permiten que el sitio recuerde información sobre tu visita (idioma preferido, si aceptaste avisos, etc.) para que la experiencia sea más fluida la próxima vez.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Cookies que utilizamos</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="border-b border-[#7C3AED]/40">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Nombre</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Tipo</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Finalidad</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Duración</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-[#7C3AED]/20">
                    <td className="py-2 pr-4 font-mono text-xs">cookie-consent</td>
                    <td className="py-2 pr-4">Técnica</td>
                    <td className="py-2 pr-4">Guarda tu elección sobre el aviso de cookies.</td>
                    <td className="py-2">1 año</td>
                  </tr>
                  <tr className="border-b border-[#7C3AED]/20">
                    <td className="py-2 pr-4 font-mono text-xs">_ga, _ga_*</td>
                    <td className="py-2 pr-4">Analítica</td>
                    <td className="py-2 pr-4">Google Analytics — mide el tráfico de forma anónima.</td>
                    <td className="py-2">26 meses</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">_gid</td>
                    <td className="py-2 pr-4">Analítica</td>
                    <td className="py-2 pr-4">Google Analytics — distingue usuarios entre sesiones.</td>
                    <td className="py-2">24 horas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Cookies de terceros</h2>
            <p>
              Cuando hacés clic en un curso y accedés a <strong>Hotmart</strong>, ese sitio puede instalar sus propias cookies bajo su <a href="https://hotmart.com/es/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">Política de Privacidad</a>. No tenemos control sobre esas cookies.
            </p>
            <p className="mt-2">
              Google Analytics está configurado con anonimización de IP. Podés conocer más sobre cómo Google usa los datos en <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">policies.google.com/privacy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Cómo gestionar las cookies</h2>
            <p>Podés controlar las cookies de varias maneras:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Desde la configuración de tu navegador (Chrome, Firefox, Safari, Edge).</li>
              <li>Usando el botón de abajo para revocar tu consentimiento en este sitio.</li>
              <li>Instalando extensiones de bloqueo de rastreo como uBlock Origin.</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              Deshabilitar las cookies analíticas no afecta la navegación ni la visualización de cursos.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Revocar tu consentimiento</h2>
            <p className="mb-4">Si querés cambiar tu decisión sobre las cookies, hacé clic aquí:</p>
            <button
              onClick={handleRevoke}
              className="px-5 py-2 border border-[#7C3AED]/60 text-[#D4AF37] rounded hover:bg-[#7C3AED]/20 transition-colors text-sm"
            >
              Restablecer preferencias de cookies
            </button>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Contacto</h2>
            <p>
              Cualquier consulta sobre esta política podés enviarla a{' '}
              <a href="mailto:180681mvs@gmail.com" className="text-[#D4AF37] hover:underline">180681mvs@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
