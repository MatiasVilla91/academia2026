import useCategories from '../hooks/useCategories';
import { getCategoryName } from '../lib/categories';

const ALL_CATEGORIES = [
  'tarot',
  'baralho_cigano',
  'chakras_energia',
  'reiki',
  'angeles',
  'numerologia_astrologia',
  'meditacion',
  'magia_plantas',
  'otros',
];

const selectCls =
  'w-full bg-[#251850] border border-[#7C3AED]/30 focus:border-[#7C3AED] rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors appearance-none cursor-pointer';

const inputCls =
  'w-full bg-[#251850] border border-[#7C3AED]/30 focus:border-[#7C3AED] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors';

const labelCls = 'text-gray-500 text-xs uppercase tracking-wider mb-2 block';

export default function FilterSidebar({ filters, onChange }) {
  const { categories } = useCategories();

  const totalAll = categories.reduce((s, c) => s + c.count, 0);
  const countFor = (cat) => categories.find((c) => c.category === cat)?.count ?? 0;

  return (
    <aside className="bg-[#1A1030] rounded-xl p-5 border border-[#7C3AED]/30 space-y-5">
      <h2 className="font-display text-[#D4AF37] text-xl">Filtros</h2>

      <input
        type="text"
        placeholder="Buscar cursos..."
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        className={inputCls}
      />

      <div>
        <label className={labelCls}>Ordenar por</label>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value, page: 1 })}
          className={selectCls}
        >
          <option value="newest">Más recientes</option>
          <option value="rating">Mejor rating</option>
          <option value="clicks">Más populares</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Categoría</label>
        <div className="space-y-0.5">
          <button
            onClick={() => onChange({ category: '', page: 1 })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
              !filters.category ? 'bg-[#7C3AED] text-white' : 'text-gray-300 hover:bg-[#251850]'
            }`}
          >
            <span>Todas</span>
            <span className="text-xs opacity-60">{totalAll}</span>
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat, page: 1 })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                filters.category === cat
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-gray-400 hover:bg-[#251850]'
              }`}
            >
              <span>{getCategoryName(cat)}</span>
              <span className="text-xs opacity-60">{countFor(cat)}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Rating mínimo</label>
        <select
          value={filters.minRating}
          onChange={(e) => onChange({ minRating: e.target.value, page: 1 })}
          className={selectCls}
        >
          <option value="">Cualquiera</option>
          <option value="3">3+ ★</option>
          <option value="4">4+ ★</option>
          <option value="4.5">4.5+ ★</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Rango de precio</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Precio mín."
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value, page: 1 })}
            className={inputCls}
          />
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Precio máx."
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value, page: 1 })}
            className={inputCls}
          />
        </div>
      </div>

      <button
        onClick={() =>
          onChange({
            search: '',
            category: '',
            minRating: '',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
            page: 1,
          })
        }
        className="w-full py-2 border border-[#7C3AED]/40 hover:border-[#7C3AED] text-gray-500 hover:text-white rounded-lg text-sm transition-colors"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}
