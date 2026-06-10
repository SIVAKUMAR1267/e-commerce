"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCartButton from "@/components/AddToCartButton";
import Pagination from "@/components/Pagination"; // Import your component!

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
        // Ask the backend for the specific page
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/trending?pageNumber=${currentPage}`);
        
        // Since we updated the backend, data is now { products, page, pages }
        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        console.error("Failed to fetch trending items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [currentPage]); // Re-run when currentPage changes!

  // Reused Render Helper
  const renderProductCard = (product, i) => (
    <div key={product._id} className="relative group min-w-[280px] sm:min-w-0">
      <Link href={`/product/${product._id}`} className="block">
        <Card hoverLift className={i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}>
          <div className="relative w-full h-64 border-b-4 border-black bg-white overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute top-4 right-4 bg-neo-secondary border-4 border-black px-2 py-1 font-black text-xs uppercase shadow-neo-sm">
              {product.category}
            </div>
            {product.isSale && (
               <div className="absolute top-4 left-4 bg-red-500 text-white border-4 border-black px-2 py-1 font-black text-xs uppercase shadow-neo-sm animate-pulse">
                 SALE
               </div>
            )}
          </div>
          <CardContent className="pt-6">
            <h2 className="text-xl font-black uppercase tracking-tight leading-tight mb-1 truncate">{product.name}</h2>
            <p className="font-bold text-black/60 uppercase text-xs tracking-widest mb-4">{product.brand}</p>
            <div className="text-2xl font-black tracking-tighter">
              {product.isSale ? (
                <>
                  <span className="line-through text-black/40 mr-2">${product.price.toFixed(2)}</span>
                  <span className="text-red-500">${product.salePrice?.toFixed(2) || (product.price * 0.8).toFixed(2)}</span>
                </>
              ) : (
                `$${product.price.toFixed(2)}`
              )}
            </div>
          </CardContent>
          <CardFooter className="pb-6 relative z-20">
            <AddToCartButton product={product} showQty={false} />
          </CardFooter>
        </Card>
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-neo-bg bg-halftone py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:-translate-y-1 transition-transform border-4 border-black bg-white px-4 py-2 shadow-neo-sm">
          <ArrowLeft className="w-5 h-5 stroke-[3px]" /> Back to Main
        </Link>

        <div className="flex items-center gap-4 mb-12 bg-white border-4 border-black p-6 shadow-neo-md -rotate-1 inline-flex">
          <Flame className="h-12 w-12 fill-orange-500 text-orange-500" />
          <h1 className="text-5xl font-black uppercase tracking-tighter">
            All <span className="text-orange-500">Trending</span>
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-24 bg-white border-4 border-black max-w-md mx-auto shadow-neo-md rotate-1">
            <div className="text-4xl font-black uppercase tracking-tighter animate-pulse">SYNCHRONIZING...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {products.map((item, i) => renderProductCard(item, i))}
            </div>

            {/* Render Pagination if there is more than 1 page */}
            {pages > 1 && (
              <Pagination 
                pages={pages} 
                page={currentPage} 
                onPageChange={setCurrentPage} 
              />
            )}
          </>
        )}
        
      </div>
    </main>
  );
}