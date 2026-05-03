import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad — Academia Astral</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="text-[#D4AF37] text-sm hover:underline mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="font-display text-3xl text-[#D4AF37] mb-2">Política de Privacidad</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: mayo de 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">1. Quiénes somos</h2>
            <p>
              Academia Astral (<strong>academia-astral.com</strong>) es un sitio web de recomendación y afiliación de cursos esotéricos disponibles en la plataforma Hotmart. No somos la empresa que vende ni imparte los cursos; actuamos únicamente como intermediarios afiliados.
            </p>
            <p className="mt-2">
              Responsable: Academia Astral<br />
              Contacto: <a href="mailto:180681mvs@gmail.com" className="text-[#D4AF37] hover:underline">180681mvs@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">2. Datos que recopilamos</h2>
            <p>No recopilamos datos personales de forma activa (nombre, email, teléfono, etc.). Los únicos datos que se procesan son:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li><strong className="text-gray-300">Cookies técnicas y de preferencia:</strong> para recordar si aceptaste este aviso y ajustar la navegación.</li>
              <li><strong className="text-gray-300">Datos de uso anónimos:</strong> a través de herramientas de análisis (como Google Analytics) que registran páginas visitadas, tiempo de sesión y dispositivo, sin identificarte personalmente.</li>
              <li><strong className="text-gray-300">Datos de tu navegador:</strong> dirección IP (anonimizada), tipo de navegador y sistema operativo, procesados automáticamente por los servidores de alojamiento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">3. Finalidad del tratamiento</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Mostrar el catálogo de cursos y permitir la navegación.</li>
              <li>Analizar el tráfico para mejorar el contenido del sitio.</li>
              <li>Gestionar las cookies según tu preferencia.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">4. Terceros y transferencia de datos</h2>
            <p>
              Cuando hacés clic en un curso y accedés a Hotmart, pasás a estar sujeto a la <a href="https://hotmart.com/es/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">Política de Privacidad de Hotmart</a>. No compartimos tus datos con terceros distintos a los proveedores de servicios necesarios para operar el sitio (alojamiento, analítica).
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">5. Tus derechos</h2>
            <p>Podés ejercer en cualquier momento los derechos de acceso, rectificación, supresión y oposición escribiendo a <a href="mailto:180681mvs@gmail.com" className="text-[#D4AF37] hover:underline">180681mvs@gmail.com</a>. Respondemos en un plazo máximo de 30 días.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">6. Conservación de datos</h2>
            <p>Los datos de analítica se conservan por el plazo estándar del proveedor (Google Analytics: 26 meses). Las cookies de preferencia se conservan hasta que las elimines o expiren (máximo 1 año).</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">7. Cookies</h2>
            <p>Para más detalle sobre el uso de cookies, consultá nuestra <Link to="/politica-cookies" className="text-[#D4AF37] hover:underline">Política de Cookies</Link>.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">8. Cambios en esta política</h2>
            <p>Podemos actualizar esta política en cualquier momento. La fecha de la última modificación siempre estará visible al inicio de esta página.</p>
          </section>
        </div>
      </div>
    </>
  );
}
