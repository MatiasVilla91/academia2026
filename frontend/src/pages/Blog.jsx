import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../lib/blogPosts';

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#0F0A1E] py-12 px-4">
      <Helmet>
        <title>Blog de Tarot y Esoterismo | Academia Astral</title>
        <meta
          name="description"
          content="Artículos sobre tarot, chakras, ángeles, numerología y espiritualidad para guiarte en tu camino de crecimiento interior."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#D4AF37] text-3xl">✦</span>
          <h1 className="font-display text-4xl text-white mt-2 mb-3">Blog Astral</h1>
          <p className="text-gray-400 text-lg">
            Artículos sobre tarot, espiritualidad y crecimiento interior
          </p>
        </div>

        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block bg-[#140D28] border border-[#7C3AED]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-xs text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-1 rounded-full capitalize">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-xs text-gray-500">{post.readTime} min de lectura</span>
              </div>
              <h2 className="font-display text-xl text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
              <span className="mt-4 inline-block text-sm text-[#D4AF37] group-hover:underline">
                Leer artículo →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
