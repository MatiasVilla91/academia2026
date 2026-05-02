import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPost } from '../lib/blogPosts';

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

  const formattedDate = new Date(post.date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0F0A1E] py-12 px-4">
      <Helmet>
        <title>{post.title} | Academia Astral</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={`${post.title} | Academia Astral`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
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

        <div className="mt-14 bg-[#140D28] border border-[#7C3AED]/30 rounded-xl p-8 text-center">
          <span className="text-[#D4AF37] text-2xl">✦</span>
          <h3 className="font-display text-2xl text-white mt-3 mb-2">
            ¿Querés profundizar en el tarot?
          </h3>
          <p className="text-gray-400 mb-6">
            En Academia Astral encontrás cursos completos de tarot para todos los niveles, con
            instructores especializados.
          </p>
          <Link
            to="/categoria/tarot"
            className="inline-block bg-[#D4AF37] text-[#0F0A1E] font-semibold px-6 py-3 rounded-lg hover:bg-[#c9a227] transition-colors"
          >
            Ver cursos de tarot
          </Link>
        </div>
      </article>
    </div>
  );
}
