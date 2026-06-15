"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Tag, Crosshair } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data: mainProduct } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        setProduct(mainProduct);

        const { data: related } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/related/${id}`);
        setRelatedProducts(related);

        const { data: sale } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/sale`);
        setSaleProducts(sale);
      } catch (error) {
        console.error("Failed to load product data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  // FIX: Applied the responsive 2-column squish-proof constraints to the mapping card
  const renderProductCard = (item, i) => (
    <div key={item._id} className="relative group w-full min-w-0">
      <Link href={`/product/${item._id}`} className="block h-full">
        <Card hoverLift className={`h-full flex flex-col w-full ${i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}`}>
          <div className="relative w-full h-36 sm:h-64 border-b-[3px] sm:border-b-4 border-black bg-white overflow-hidden shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-neo-secondary border-2 sm:border-4 border-black px-1.5 py-0.5 sm:px-2 sm:py-1 font-black text-[10px] sm:text-xs uppercase shadow-neo-sm">
              {item.category}
            </div>
            {item.isSale && (
               <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white border-2 sm:border-4 border-black px-1.5 py-0.5 sm:px-2 sm:py-1 font-black text-[10px] sm:text-xs uppercase shadow-neo-sm animate-pulse">
               SALE
             </div>
            )}
          </div>
          <CardContent className="p-2 sm:p-6 flex-grow flex flex-col justify-between overflow-hidden">
            <div>
              <h2 className="text-[11px] sm:text-xl font-black uppercase tracking-tight leading-tight mb-1 line-clamp-2 break-words">{item.name}</h2>
              <p className="font-bold text-black/60 uppercase text-[9px] sm:text-xs tracking-widest mb-2 sm:mb-4 truncate">{item.brand}</p>
            </div>
            <div className="text-base sm:text-2xl font-black tracking-tighter mt-auto pt-1">
              {item.isSale ? (
                <div className="flex flex-wrap items-center gap-x-1 sm:gap-x-2">
                  <span className="line-through text-black/40 text-xs sm:text-xl">${item.price?.toFixed(2)}</span>
                  <span className="text-red-500">${item.salePrice?.toFixed(2) || (item.price * 0.8).toFixed(2)}</span>
                </div>
              ) : (
                `$${item.price?.toFixed(2)}`
              )}
            </div>
          </CardContent>
          <CardFooter className="p-2 sm:p-6 pt-0 sm:pt-0 relative z-20 mt-auto w-full">
            <AddToCartButton product={item} showQty={false} />
          </CardFooter>
        </Card>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-bg bg-halftone flex items-center justify-center p-4">
        <div className="text-center py-16 sm:py-24 bg-white border-[3px] sm:border-4 border-black px-6 sm:px-12 shadow-neo-md rotate-1">
          <div className="text-2xl sm:text-4xl font-black uppercase tracking-tighter animate-pulse">EXTRACTING ITEM...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neo-bg bg-halftone pb-16 sm:pb-24 w-full overflow-hidden sm:overflow-visible">
      
      {/* 1. BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-3 sm:px-12 pt-6 sm:pt-8 mb-6 sm:mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 bg-white border-[3px] sm:border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:bg-neo-secondary transition-all"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3px]" /> Return
        </button>
      </div>

      {/* 2. MAIN PRODUCT VIEW */}
      <section className="max-w-7xl mx-auto px-3 sm:px-12 mb-16 sm:mb-24">
        {/* FIX: Reduced padding (p-4 vs p-8) and gap on mobile, stacked layout for small screens */}
        <div className="bg-white border-[3px] sm:border-4 border-black shadow-neo-md sm:shadow-neo-xl p-4 sm:p-8 flex flex-col md:grid md:grid-cols-2 gap-6 sm:gap-12 items-start">
          <img src={product.image} alt={product.name} className="w-full border-[3px] sm:border-4 border-black shadow-neo-sm sm:shadow-neo-md" />
          
          <div className="space-y-4 sm:space-y-6 w-full">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none break-words">{product.name}</h1>
            
            <div className="text-2xl sm:text-3xl font-black flex flex-wrap items-center gap-2 sm:gap-4">
              {product.isSale ? (
                <>
                  <span className="line-through text-black/40 text-lg sm:text-xl">${product.price?.toFixed(2)}</span>
                  <span className="text-red-500">${product.salePrice?.toFixed(2) || (product.price * 0.8).toFixed(2)}</span>
                </>
              ) : (
                <span>${product.price?.toFixed(2)}</span>
              )}
            </div>

            <p className="text-sm sm:text-lg font-bold text-black/80">{product.description}</p>
            
            <div className="pt-2 sm:pt-4 w-full">
              <AddToCartButton product={product} showQty={true} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. ITEMS YOU MIGHT LIKE */}
      {relatedProducts.length > 0 && (
        <section className="w-full mb-16 sm:mb-24">
          {/* FIX: Full width, edge-to-edge banner header */}
          <div className="w-full border-y-[3px] sm:border-y-8 border-black bg-white mb-6 sm:mb-8 py-3 sm:py-6 px-3 sm:px-12">
            <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4">
              <Crosshair className="h-6 w-6 sm:h-10 sm:w-10 stroke-[3px]" />
              <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter">
                You Might <span className="text-neo-accent">Like</span>
              </h2>
            </div>
          </div>
          
          {/* FIX: 2-column mobile grid replacing the horizontal flex scroll */}
          <div className="max-w-7xl mx-auto px-3 sm:px-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full">
              {relatedProducts.map((item, i) => renderProductCard(item, i))}
            </div>
          </div>
        </section>
      )}

      {/* 4. ITEMS ON SALE */}
      {saleProducts.length > 0 && (
        <section className="w-full">
          {/* FIX: Full width, edge-to-edge banner header */}
          <div className="w-full border-y-[3px] sm:border-y-8 border-black bg-white mb-6 sm:mb-8 py-3 sm:py-6 px-3 sm:px-12">
            <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4">
              <Tag className="h-6 w-6 sm:h-10 sm:w-10 fill-red-500 text-red-500" />
              <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter">
                System <span className="text-red-500">Clearance</span>
              </h2>
            </div>
          </div>

          {/* FIX: 2-column mobile grid */}
          <div className="max-w-7xl mx-auto px-3 sm:px-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full">
              {saleProducts.map((item, i) => renderProductCard(item, i))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}