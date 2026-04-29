function SkeletonCard() {
  return (
    <div className="bg-[#1A1030] rounded-xl overflow-hidden border border-[#7C3AED]/20 animate-pulse">
      <div className="h-48 bg-[#251850]" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#251850] rounded w-3/4" />
        <div className="h-4 bg-[#251850] rounded w-1/2" />
        <div className="h-4 bg-[#251850] rounded w-1/3" />
        <div className="h-9 bg-[#251850] rounded mt-2" />
      </div>
    </div>
  );
}

export default function Loading({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
