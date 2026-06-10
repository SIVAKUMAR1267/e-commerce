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
  const [relatedProducts, setRelatedProducts] = useState([]); // "You Might Like"
  const [saleProducts, setSaleProducts] = useState([]);       // "On Sale"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // 1. Fetch the main product the user clicked on
        const { data: mainProduct } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        setProduct(mainProduct);

        // 2. Fetch "Items You Might Like" (Same category, excluding this exact item)
        const { data: related } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/related/${id}`);
        setRelatedProducts(related);

        // 3. Fetch "Items On Sale"
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

  // Helper function to render the exact same brutalist cards from the homepage
  const renderProductCard = (item, i) => (
    <div key={item._id} className="relative group min-w-[280px] sm:min-w-0">
      <Link href={`/product/${item._id}`} className="block">
        <Card hoverLift className={i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}>
          <div className="relative w-full h-64 border-b-4 border-black bg-white overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute top-4 right-4 bg-neo-secondary border-4 border-black px-2 py-1 font-black text-xs uppercase shadow-neo-sm">
              {item.category}
            </div>
            {item.isSale && (
               <div className="absolute top-4 left-4 bg-red-500 text-white border-4 border-black px-2 py-1 font-black text-xs uppercase shadow-neo-sm animate-pulse">
               SALE
             </div>
            )}
          </div>
          <CardContent className="pt-6">
            <h2 className="text-xl font-black uppercase tracking-tight leading-tight mb-1 truncate">{item.name}</h2>
            <p className="font-bold text-black/60 uppercase text-xs tracking-widest mb-4">{item.brand}</p>
            <div className="text-2xl font-black tracking-tighter">
              {item.isSale ? (
                <>
                  <span className="line-through text-black/40 mr-2">${item.price?.toFixed(2)}</span>
                  <span className="text-red-500">${item.salePrice?.toFixed(2) || (item.price * 0.8).toFixed(2)}</span>
                </>
              ) : (
                `$${item.price?.toFixed(2)}`
              )}
            </div>
          </CardContent>
          <CardFooter className="pb-6 relative z-20">
            <AddToCartButton product={item} showQty={false} />
          </CardFooter>
        </Card>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-bg bg-halftone flex items-center justify-center">
        <div className="text-center py-24 bg-white border-4 border-black px-12 shadow-neo-md rotate-1">
          <div className="text-4xl font-black uppercase tracking-tighter animate-pulse">EXTRACTING ITEM...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neo-bg bg-halftone pb-24">
      
      {/* 1. BACK BUTTON */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase shadow-neo-sm hover:-translate-y-1 hover:bg-neo-secondary transition-all"
        >
          <ArrowLeft className="h-5 w-5 stroke-[3px]" /> Return to Catalog
        </button>
      </div>

      {/* 2. MAIN PRODUCT VIEW */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
        <div className="bg-white border-4 border-black shadow-neo-xl p-8 grid md:grid-cols-2 gap-12 items-center">
          <img src={product.image} alt={product.name} className="w-full border-4 border-black shadow-neo-md" />
          <div className="space-y-6">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{product.name}</h1>
            
            {/* DYNAMIC PRICE FIX: Checks for sale status before rendering */}
            <div className="text-3xl font-black flex items-center gap-4">
              {product.isSale ? (
                <>
                  <span className="line-through text-black/40 text-xl">${product.price?.toFixed(2)}</span>
                  <span className="text-red-500">${product.salePrice?.toFixed(2) || (product.price * 0.8).toFixed(2)}</span>
                </>
              ) : (
                <span>${product.price?.toFixed(2)}</span>
              )}
            </div>

            <p className="text-lg font-bold">{product.description}</p>
            <AddToCartButton product={product} showQty={true} />
          </div>
        </div>
      </section>

      {/* 3. ITEMS YOU MIGHT LIKE (Related Category Algorithm) */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <div className="flex items-center gap-4 mb-8 border-b-8 border-black pb-4">
            <Crosshair className="h-10 w-10 stroke-[3px]" />
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">
              Items You Might <span className="text-neo-accent">Like</span>
            </h2>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 brutal-scroll">
            {relatedProducts.map((item, i) => (
              <div key={item._id} className="snap-start shrink-0 w-80">
                {renderProductCard(item, i)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. ITEMS ON SALE (Global Clearance Algorithm) */}
      {saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex items-center gap-4 mb-8 border-b-8 border-black pb-4">
            <Tag className="h-10 w-10 fill-red-500 text-red-500" />
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">
              System <span className="text-red-500">Clearance</span>
            </h2>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 brutal-scroll">
            {saleProducts.map((item, i) => (
              <div key={item._id} className="snap-start shrink-0 w-80">
                {renderProductCard(item, i)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Global CSS to hide the scrollbar but keep swipe functionality */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

    </main>
  );
}