import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPost, getRelatedPosts } from '../lib/blogPosts';
import { SITE_NAME, SITE_URL } from '../lib/site';

const categoryContent = {
  tarot: {
    relatedTitle: 'Seguí leyendo sobre tarot',
    ctaTitle: '¿Querés profundizar en el tarot?',
    ctaText:
      'En Academia Astral encontrás cursos completos de tarot para todos los niveles, con instructores especializados.',
    ctaLabel: 'Ver cursos de tarot',
    ctaHref: '/categoria/tarot',
  },
  reiki: {
    relatedTitle: 'Seguí leyendo sobre reiki',
    ctaTitle: '¿Querés profundizar en el reiki?',
    ctaText:
      'En Academia Astral encontrás cursos de reiki para empezar desde cero o avanzar en tu práctica con una base más sólida.',
    ctaLabel: 'Ver cursos de reiki',
    ctaHref: '/categoria/reiki',
  },
};

function renderBlock(block, i) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="font-display text-2xl text-[#D4AF37] mt-10 mb-4">
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p key={i} className="text-gray-300 leading-relaxed mb-5">
          {block.text}
        </p>
      );
    case 'ul':
      return (
        <ul key={i} className="list-disc list-outside pl-6 space-y-2 mb-5 text-gray-300">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i} className="list-decimal list-outside pl-6 space-y-2 mb-5 text-gray-300">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const relatedPosts = getRelatedPosts(post);
  const currentCategoryContent = categoryContent[post.category] || {
    relatedTitle: 'Seguí leyendo en el blog',
    ctaTitle: '¿Querés seguir profundizando?',
    ctaText:
      'En Academia Astral encontrás más contenidos y cursos para avanzar con una base más clara en esta temática.',
    ctaLabel: 'Explorar categoría',
    ctaHref: `/categoria/${post.category}`,
  };
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    inLanguage: 'es',
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  const formattedDate = new Date(post.date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0F0A1E] py-12 px-4">
      <Helmet>
        <title>{post.title} | {SITE_NAME}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${post.title} | ${SITE_NAME}`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="article:published_time" content={post.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      </Helmet>

      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors mb-8 inline-block"
        >
          ← Volver al blog
        </Link>

        <header className="mb-10 border-b border-[#7C3AED]/20 pb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-1 rounded-full capitalize">
              {post.category}
            </span>
            <span className="text-xs text-gray-500">{formattedDate}</span>
            <span className="text-xs text-gray-500">{post.readTime} min de lectura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">{post.description}</p>
        </header>

        <div>{post.content.map((block, i) => renderBlock(block, i))}</div>

        {relatedPosts.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl text-white mb-5">
              {currentCategoryContent.relatedTitle}
            </h2>
            <div className="grid gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="block rounded-xl border border-[#7C3AED]/20 bg-[#140D28] p-5 hover:border-[#D4AF37]/40 transition-colors"
                >
                  <h3 className="font-display text-xl text-white mb-2">{related.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{related.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 bg-[#140D28] border border-[#7C3AED]/30 rounded-xl p-8 text-center">
          <span className="text-[#D4AF37] text-2xl">✦</span>
          <h3 className="font-display text-2xl text-white mt-3 mb-2">
            {currentCategoryContent.ctaTitle}
          </h3>
          <p className="text-gray-400 mb-6">{currentCategoryContent.ctaText}</p>
          <Link
            to={currentCategoryContent.ctaHref}
            className="inline-block bg-[#D4AF37] text-[#0F0A1E] font-semibold px-6 py-3 rounded-lg hover:bg-[#c9a227] transition-colors"
          >
            {currentCategoryContent.ctaLabel}
          </Link>
        </div>
      </article>
    </div>
  );
}
