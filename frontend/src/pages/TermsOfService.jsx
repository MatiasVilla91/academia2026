import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Términos y Condiciones — Academia Astral</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="text-[#D4AF37] text-sm hover:underline mb-8 inline-block">
          ← Volver al inicio
        </Link>

        <h1 className="font-display text-3xl text-[#D4AF37] mb-2">Términos y Condiciones</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: mayo de 2025</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar Academia Astral (<strong>academia-astral.com</strong>), aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, te pedimos que no utilices el sitio.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">2. Naturaleza del servicio</h2>
            <p>
              Academia Astral es un catálogo de recomendación de cursos esotéricos publicados en la plataforma Hotmart. <strong>No somos una institución educativa, ni el proveedor de los cursos.</strong> Los contenidos, instructores, precios y condiciones de cada curso son responsabilidad exclusiva de sus respectivos creadores en Hotmart.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">3. Divulgación de afiliados</h2>
            <p>
              Los enlaces a cursos en este sitio son <strong>enlaces de afiliado de Hotmart</strong>. Esto significa que si adquirís un curso a través de nuestros links, podemos recibir una comisión sin costo adicional para vos. Esta comisión nos permite mantener el sitio en funcionamiento.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">4. Precios e información de cursos</h2>
            <p>
              Los precios, descripciones y demás datos de los cursos mostrados en este sitio son informativos y pueden no estar actualizados. <strong>El precio definitivo y las condiciones de compra siempre se muestran en la página oficial de Hotmart</strong> al momento de la compra.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">5. Limitación de responsabilidad</h2>
            <p>Academia Astral no se hace responsable de:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>La calidad, veracidad o resultados de los cursos ofrecidos en Hotmart.</li>
              <li>Problemas técnicos, disputas de compra o reembolsos (gestionados por Hotmart).</li>
              <li>Daños directos o indirectos derivados del uso de la información publicada en este sitio.</li>
              <li>La disponibilidad continua del sitio o de los cursos listados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">6. Propiedad intelectual</h2>
            <p>
              El diseño, textos e imágenes propios de Academia Astral son propiedad de sus autores y no pueden ser reproducidos sin autorización. Las imágenes y marcas de los cursos pertenecen a sus respectivos instructores o a Hotmart.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">7. Uso aceptable</h2>
            <p>Queda prohibido utilizar este sitio para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Scraping masivo o uso automatizado no autorizado del contenido.</li>
              <li>Reproducir el catálogo con fines comerciales sin consentimiento expreso.</li>
              <li>Actividades ilegales o que violen los derechos de terceros.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">8. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia se someterá a los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">9. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estos términos, escribí a{' '}
              <a href="mailto:180681mvs@gmail.com" className="text-[#D4AF37] hover:underline">180681mvs@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
