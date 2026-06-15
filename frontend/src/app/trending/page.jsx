"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCartButton from "@/components/AddToCartButton";
import Pagination from "@/components/Pagination";

export default function TrendingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/trending?pageNumber=${currentPage}`);
        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        console.error("Failed to fetch trending items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [currentPage]);

  // Reused Render Helper (Fully Fluid & Responsive)
  const renderProductCard = (product, i) => (
    <div key={product._id} className="relative group w-full min-w-0">
      <Link href={`/product/${product._id}`} className="block h-full">
        <Card hoverLift className={`h-full flex flex-col w-full ${i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}`}>
          
          {/* Image & Badges: Shrunk heights and borders on mobile */}
          <div className="relative w-full h-36 sm:h-64 border-b-[3px] sm:border-b-4 border-black bg-white overflow-hidden shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-neo-secondary border-2 sm:border-4 border-black px-1.5 py-0.5 sm:px-2 sm:py-1 font-black text-[10px] sm:text-xs uppercase shadow-neo-sm">
              {product.category}
            </div>
            {product.isSale && (
               <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white border-2 sm:border-4 border-black px-1.5 py-0.5 sm:px-2 sm:py-1 font-black text-[10px] sm:text-xs uppercase shadow-neo-sm animate-pulse">
                 SALE
               </div>
            )}
          </div>

          {/* Content: p-2 on mobile prevents overflow, line-clamp-2 allows clean wrapping */}
          <CardContent className="p-2 sm:p-6 flex-grow flex flex-col justify-between overflow-hidden">
            <div>
              <h2 className="text-[11px] sm:text-xl font-black uppercase tracking-tight leading-tight mb-1 line-clamp-2 break-words">
                {product.name}
              </h2>
              <p className="font-bold text-black/60 uppercase text-[9px] sm:text-xs tracking-widest mb-2 sm:mb-4 truncate">
                {product.brand}
              </p>
            </div>
            
            <div className="text-base sm:text-2xl font-black tracking-tighter mt-auto pt-1">
              {product.isSale ? (
                <div className="flex flex-wrap items-center gap-x-1 sm:gap-x-2">
                  <span className="line-through text-black/40 text-xs sm:text-xl">${product.price.toFixed(2)}</span>
                  <span className="text-red-500">${product.salePrice?.toFixed(2) || (product.price * 0.8).toFixed(2)}</span>
                </div>
              ) : (
                `$${product.price.toFixed(2)}`
              )}
            </div>
          </CardContent>

          {/* Footer: Minimized padding on mobile */}
          <CardFooter className="p-2 sm:p-6 pt-0 sm:pt-0 relative z-20 mt-auto w-full">
            <AddToCartButton product={product} showQty={false} />
          </CardFooter>
        </Card>
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-neo-bg bg-halftone py-8 sm:py-12 px-3 sm:px-6 w-full overflow-hidden sm:overflow-visible">
      <div className="max-w-7xl mx-auto w-full">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-base font-black uppercase mb-6 sm:mb-8 hover:-translate-y-1 transition-transform border-[3px] sm:border-4 border-black bg-white px-3 py-1.5 sm:px-4 sm:py-2 shadow-neo-sm">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" /> Back to Main
        </Link>

        {/* Banner: Responsive sizing and explicit 4px (mobile) to 8px (desktop) shadow offsets */}
        <div className="flex sm:inline-flex items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-8 sm:mb-12 bg-white border-[3px] sm:border-4 border-black p-3 sm:p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] -rotate-1 w-full max-w-[280px] sm:max-w-none mx-auto sm:mx-0">
          <Flame className="h-8 w-8 sm:h-12 sm:w-12 fill-orange-500 text-orange-500 shrink-0" />
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            All <span className="text-orange-500">Trending</span>
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-16 sm:py-24 bg-white border-[3px] sm:border-4 border-black max-w-[280px] sm:max-w-md mx-auto shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] rotate-1">
            <div className="text-2xl sm:text-4xl font-black uppercase tracking-tighter animate-pulse">SYNCHRONIZING...</div>
          </div>
        ) : (
          <>
            {/* Grid: 2 columns strictly enforced on mobile with gap-2 to save space */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8 w-full">
                {products.map((product, i) => renderProductCard(product, i))}
            </div>

            {pages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination 
                  pages={pages} 
                  page={currentPage} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            )}
          </>
        )}
        
      </div>
    </main>
  );
}