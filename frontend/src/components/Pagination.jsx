export default function Pagination({ pages, page, onPageChange }) {
  if (pages <= 1) return null; // Hide if there's only 1 page

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-12 mb-8">
      {[...Array(pages).keys()].map((x) => {
        const pageNumber = x + 1;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`
              w-12 h-12 flex items-center justify-center font-black text-xl border-4 border-black transition-all cursor-pointer shadow-neo-sm hover:-translate-y-1
              ${pageNumber === page ? 'bg-neo-accent text-white shadow-neo-md' : 'bg-white text-black hover:bg-neo-secondary'}
            `}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
}