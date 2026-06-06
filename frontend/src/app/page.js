"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Search, SlidersHorizontal, Sparkles, ArrowDown, Flame } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Categories derived directly from our system specs
  const categories = ["ALL", "APPAREL", "SHOES", "TECH", "SPORTS"];
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Use an endpoint the app actually depends on
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/health`,
          {
            timeout: 10000,
          }
        );

        setBackendReady(true);
      } catch (error) {
        console.error("Backend unavailable:", error);

        router.replace("/booting");
      }
    };

    checkBackend();
  }, [router]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products from DB, applying default catalog.");
        // Fallback local dataset matching database seed records
        const fallback = [
          { _id: '1', name: 'Vintage High-Tops', brand: 'Kicks', category: 'SHOES', price: 120.00, countInStock: 5, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80' },
          { _id: '2', name: 'Graphic Heavy Tee', brand: 'Streetwear Cartel', category: 'APPAREL', price: 45.00, countInStock: 10, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80' },
          { _id: '3', name: 'Mechanical Keyboard', brand: 'TechCo', category: 'TECH', price: 150.00, countInStock: 2, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80' },
          { _id: '4', name: 'Retro Skateboard', brand: 'Decked', category: 'SPORTS', price: 85.00, countInStock: 0, image: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&q=80' },
        ];
        setProducts(fallback);
        setFilteredProducts(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Live filter computation executed instantly on state modification
  useEffect(() => {
    let result = products;

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "ALL") {
      result = result.filter((p) => p.category.toUpperCase() === selectedCategory);
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  return (
    <main className="min-h-screen bg-neo-bg bg-halftone pb-24">
      
      {/* 1. THE HERO ZONE */}
      <section className="border-b-8 border-black bg-white relative overflow-hidden py-20 px-6 sm:px-12">
        {/* Subtle grid line backdrop inside the white hero container */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-neo-secondary border-4 border-black px-4 py-1.5 font-black uppercase text-sm tracking-widest shadow-neo-sm rotate-[-1deg]">
              <Flame className="h-4 w-4 fill-black animate-pulse" /> SYSTEM STABLE // DRIPPED LOUD
            </div>
            
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
              UNFILTERED
              <br />
              <span className="text-stroke">STREET</span>
              <span className="bg-neo-accent text-white px-4 inline-block rotate-1 shadow-neo-sm my-2 border-4 border-black">
                WEAR
              </span>
            </h1>
            
            <p className="text-xl font-bold max-w-xl leading-snug">
              Raw structural honesty meets high-saturation energy. This isn't a generic catalog—it's built to break boundaries. Secure your haul below.
            </p>

            <div className="pt-4">
              <Button size="lg" className="text-xl h-16 px-8 group rotate-[-1deg] hover:rotate-0" onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}>
                BROWSE COCKPIT <ArrowDown className="ml-2 h-6 w-6 stroke-[3px] group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Chaos Zone / Visual Asset Display */}
            <div className="lg:col-span-5 relative hidden lg:block justify-self-center">
              <div className="absolute inset-0 bg-neo-muted border-4 border-black translate-x-4 translate-y-4 shadow-neo-md" />
              
              {/* I removed "overflow-hidden" here so the sticker can pop out of the frame! */}
              <div className="relative border-4 border-black bg-neo-secondary p-12 h-96 w-96 flex flex-col justify-between shadow-neo-sm rotate-2">
                
                {/* THE FIXED CIRCULAR STICKER WITH SVG CURVED TEXT */}
                <div className="absolute -right-12 -top-12 border-4 border-black rounded-full h-32 w-32 bg-white flex items-center justify-center z-20 animate-[spin_8s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* This invisible path is what the text curves around */}
                    <path id="textPath" d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="transparent" />
                    <text className="font-black text-[12px] tracking-widest fill-black uppercase">
                      <textPath href="#textPath" startOffset="0%">
                        • RETRO • STYLE • SYSTEM • 
                      </textPath>
                    </text>
                  </svg>
                </div>

                <Sparkles className="h-16 w-16 stroke-[3px]" />
                <div>
                  <div className="text-6xl font-black tracking-tighter leading-none mb-2">40% OFF</div>
                  <div className="font-bold tracking-widest uppercase text-sm border-t-4 border-black pt-2">USE CODE: BRUTAL</div>
                </div>
              </div>
            </div>

        </div>
      </section>

      {/* 2. RUNNING TEXT MARQUEE */}
      <div className="bg-black text-white border-b-4 border-black py-4 overflow-hidden whitespace-nowrap select-none font-black uppercase text-xl sm:text-2xl tracking-widest flex">
        <div className="animate-[marquee_25s_linear_infinite] flex shrink-0 gap-16 min-w-full">
          <span>⚡ NEW ERA PRODUCTS DROP EVERY SUNDAY</span>
          <span>⚡ FREE GLOBAL SHIPPING OVER $100</span>
          <span>⚡ 100% SECURE CUSTOM PAYMENT NETWORKS</span>
          <span>⚡ JOIN THE CARTEL COMMUNITY</span>
        </div>
        <div className="animate-[marquee_25s_linear_infinite] flex shrink-0 gap-16 min-w-full" aria-hidden="true">
          <span>⚡ NEW ERA PRODUCTS DROP EVERY SUNDAY</span>
          <span>⚡ FREE GLOBAL SHIPPING OVER $100</span>
          <span>⚡ 100% SECURE CUSTOM PAYMENT NETWORKS</span>
          <span>⚡ JOIN THE CARTEL COMMUNITY</span>
        </div>
      </div>

      {/* 3. DYNAMIC CONTROLS & GRID CONTAINER */}
      <section id="catalog" className="max-w-7xl mx-auto px-6 sm:px-12 pt-16">
        
        {/* INTERACTIVE CONTROLS BAR */}
        <div className="bg-white border-4 border-black p-6 shadow-neo-md mb-12 flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
          
          {/* Search Box Configuration */}
          <div className="relative flex-grow max-w-xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 stroke-[3px] text-black" />
            </div>
            <Input 
              type="text" 
              placeholder="SEARCH SYSTEM INVENTORY..." 
              className="pl-12 font-bold uppercase"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categorical Toggle Strip */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black text-white p-2 border-2 border-black hidden xl:block">
              <SlidersHorizontal className="h-5 w-5 stroke-[3px]" />
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`border-4 border-black px-4 py-2 font-black text-sm uppercase tracking-wide transition-all duration-100 ${
                  selectedCategory === cat 
                    ? "bg-neo-secondary shadow-none translate-x-[2px] translate-y-[2px]" 
                    : "bg-white shadow-neo-sm hover:bg-neo-bg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* LOADING INDICATOR STATE */}
        {loading ? (
          <div className="text-center py-24 bg-white border-4 border-black max-w-md mx-auto shadow-neo-md rotate-1">
            <div className="text-4xl font-black uppercase tracking-tighter animate-pulse">SYNCHRONIZING...</div>
          </div>
        ) : (
          <>
            {/* INVENTORY MAPPING CONTAINER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, i) => (
                <div key={product._id} className="relative group">
                  <Link href={`/product/${product._id}`} className="block">
                    <Card hoverLift className={i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}>
                      
                      {/* Visual Framing Asset Wrapper */}
                      <div className="relative w-full h-64 border-b-4 border-black bg-white overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 bg-neo-secondary border-4 border-black px-2 py-1 font-black text-xs uppercase shadow-neo-sm">
                          {product.category}
                        </div>
                      </div>
                      
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight leading-tight mb-1 truncate">
                          {product.name}
                        </h2>
                        <p className="font-bold text-black/60 uppercase text-xs tracking-widest mb-4">
                          {product.brand}
                        </p>
                        <div className="text-3xl font-black tracking-tighter">
                          ${product.price.toFixed(2)}
                        </div>
                      </CardContent>
                      
                      {/* Decoupled interactive controls platform overlay */}
                      <CardFooter className="pb-6 relative z-20">
                        <AddToCartButton product={product} showQty={false} />
                      </CardFooter>

                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            {/* NULL DISCOVERY VALUE BLOCK */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white border-4 border-black max-w-xl mx-auto shadow-neo-md rotate-[-1deg]">
                <p className="font-black text-2xl uppercase">NO MATCHES FOUND IN SYSTEM</p>
                <p className="font-bold text-black/60 uppercase text-sm mt-2">Try tuning down the variables or query string.</p>
              </div>
            )}
          </>
        )}

      </section>

      {/* Global CSS Injection for the structural scrolling Marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

    </main>
  );
}