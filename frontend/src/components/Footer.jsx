export default function Footer() {
  return (
    <footer className="bg-[#140D28] border-t border-[#7C3AED]/30 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-[#D4AF37] text-2xl">✦</span>
        <p className="font-display text-[#D4AF37] text-xl mt-2 mb-1">Academia Astral</p>
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
