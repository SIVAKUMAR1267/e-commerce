"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Search, SlidersHorizontal, Sparkles, ArrowDown, Flame, Zap, Tag } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import { useRouter } from "next/navigation"; 
import Pagination from "@/components/Pagination";

export default function Home() {
  const router = useRouter();

 // --- Hero Slider Matrix ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      badge: "SYSTEM STABLE // DRIPPED LOUD",
      title1: "UNFILTERED",
      title2: "STREET",
      titleAccent: "WEAR",
      desc: "Raw structural honesty meets high-saturation energy. This catalog is built to break boundaries. Secure your haul below.",
      bg: "bg-white",
      text: "text-black",
      stroke: "[-webkit-text-stroke:2px_black]",
      accent: "bg-neo-accent text-black", 
      boxBg: "bg-neo-secondary", 
      icon: <Flame className="h-5 w-5 stroke-[3px]" />
    },
    {
      badge: "GHOST PROTOCOL // OVERRIDE",
      title1: "NIGHT",
      title2: "OPERATOR",
      titleAccent: "RIGS",
      desc: "Stealth-oriented high-density outerwear. Pure structural infrastructure built for the urban grid.",
      bg: "bg-black",
      text: "text-white",
      stroke: "[-webkit-text-stroke:2px_white]",
      accent: "bg-purple-500 text-white",
      boxBg: "bg-zinc-800",
      icon: <Zap className="h-5 w-5 stroke-[3px] text-yellow-400" />
    },
    {
      badge: "CLEARANCE EVENT // SEVERE DROP",
      title1: "LIQUIDATING",
      title2: "MANIFEST",
      titleAccent: "SALE",
      desc: "Prices crushed directly within the catalog nodes. Deploy promo codes immediately at checkout.",
      bg: "bg-red-500",
      text: "text-black",
      stroke: "[-webkit-text-stroke:2px_black]",
      accent: "bg-white text-black",
      boxBg: "bg-black text-white",
      icon: <Tag className="h-5 w-5 stroke-[3px]" />
    }
  ];
  // --- Client-Safe Barcode State to prevent Hydration Mismatches ---
  const [barcodeHeights, setBarcodeHeights] = useState([50, 70, 40, 85, 60, 45, 90, 55]);

  useEffect(() => {
    // This runs strictly on the client browser post-hydration
    const randomHeights = [...Array(8)].map(() => Math.random() * (100 - 20) + 20);
    setBarcodeHeights(randomHeights);
  }, [currentSlide]); // Re-scrambles the barcode rows every time the slide shifts!
  // Auto-scroll loop (6 seconds)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  // --- React State for Pagination ---
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [sale, setSale] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  const [initialBoot, setInitialBoot] = useState(true); 

  const categories = ["ALL", "APPAREL", "SHOES", "TECH", "SPORTS"];

  // 1. Debounce Search AND Reset Page Number
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Reset Page Number on Category Change
  useEffect(() => {
    setCurrentPage(1); 
  }, [selectedCategory]);

  // 3. Fetch All Data (Cleaned and Deduplicated)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (initialBoot) {
          const { data: trendingData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/trending`);
          setTrending(trendingData);

          const { data: saleData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/sale`);
          setSale(saleData);
        }

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products?pageNumber=${currentPage}&keyword=${debouncedSearch}&category=${selectedCategory}`
        );
        
        setProducts(data.products || data); 
        setPages(data.pages || 1);
        setPage(data.page || 1);

      } catch (error) {
        console.error("Failed to fetch products. Check if backend is running!");
      } finally {
        setInitialBoot(false); 
      }
    };

    fetchAllData(); // Call it immediately
    
  }, [currentPage, debouncedSearch, selectedCategory, initialBoot]); 

  // Helper function to render product cards and keep code DRY
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
    <main className="min-h-screen bg-neo-bg bg-halftone pb-24 overflow-hidden">
      
      {/* 1. THE HERO ZONE */}
      {/* 1. THE HERO ZONE (NEO-BRUTALIST MULTI-SLIDE) */}
      <section className={`relative border-b-8 border-black transition-colors duration-700 overflow-hidden ${heroSlides[currentSlide].bg} ${heroSlides[currentSlide].text}`}>
        
        {/* Abstract Grid Texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none mix-blend-overlay" />

        {/* MANUAL ARROW TABS */}
        <button 
          onClick={prevSlide} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white text-black border-y-4 border-r-4 border-black px-2 py-8 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:pr-4 hover:bg-neo-accent transition-all"
        >
          &lt;&lt;
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white text-black border-y-4 border-l-4 border-black px-2 py-8 font-black shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] hover:pl-4 hover:bg-neo-accent transition-all"
        >
          &gt;&gt;
        </button>

        <div className="max-w-7xl mx-auto px-16 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 min-h-[550px]">
          
          {/* LEFT: HEAVY TYPOGRAPHY */}
          <div key={currentSlide} className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">
            
            <div className={`inline-flex items-center gap-3 bg-white text-black border-4 border-black px-4 py-2 font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1`}>
              {heroSlides[currentSlide].icon} {heroSlides[currentSlide].badge}
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              {heroSlides[currentSlide].title1}<br />
              <span className={`text-transparent ${heroSlides[currentSlide].stroke}`}>
                {heroSlides[currentSlide].title2} 
              </span><br />
              <span className={`${heroSlides[currentSlide].accent} px-4 inline-block rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-2 border-4 border-black`}>
                {heroSlides[currentSlide].titleAccent}
              </span>
            </h1>

            <p className="text-xl font-bold max-w-lg leading-snug bg-white/10 backdrop-blur-md p-4 border-l-8 border-current">
              {heroSlides[currentSlide].desc}
            </p>

            <Button 
              size="lg" 
              className="text-xl h-16 px-8 group rotate-[-1deg] hover:rotate-1 bg-black text-white hover:bg-white hover:text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
              onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
            >
              BROWSE CATALOG <ArrowDown className="ml-2 h-6 w-6 stroke-[3px] group-hover:translate-y-2 transition-transform" />
            </Button>
          </div>

          {/* RIGHT: ABSTRACT HARDWARE WIDGET (No Counters) */}
          <div className="relative hidden lg:flex justify-end items-center h-full">
            {/* The rotating background slab */}
            <div className={`absolute w-72 h-72 border-8 border-black ${heroSlides[currentSlide].boxBg} shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-6 transition-colors duration-700`} />
            
            {/* The foreground terminal block */}
            <div className="absolute w-64 h-64 border-8 border-black bg-white -rotate-3 p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="border-b-4 border-black pb-2 flex justify-between items-center text-black">
                <span className="font-black tracking-widest uppercase text-sm">SYS_NODE_OK</span>
                <div className="h-4 w-4 bg-red-500 rounded-full animate-ping" />
              </div>
              
              {/* Dynamic Barcode Matrix */}
              <div className="flex gap-2 h-20 w-full items-end mt-4">
                {barcodeHeights.map((height, i) => (
                  <div 
                    key={i} 
                    className="bg-black w-full" 
                    style={{ 
                      height: `${height}%`, // Fully client-stabilized calculations
                      transition: 'height 0.5s ease-in-out'
                    }} 
                  />
                ))}
              </div>
              
              {/* Fake Version Numbering (Visual flair, not a slide counter) */}
              <div className="text-4xl font-black uppercase text-black tracking-tighter text-right mt-4">
                V.0{currentSlide + 1}
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
        </div>
        <div className="animate-[marquee_25s_linear_infinite] flex shrink-0 gap-16 min-w-full" aria-hidden="true">
          <span>⚡ NEW ERA PRODUCTS DROP EVERY SUNDAY</span>
          <span>⚡ FREE GLOBAL SHIPPING OVER $100</span>
          <span>⚡ 100% SECURE CUSTOM PAYMENT NETWORKS</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 space-y-24">
        
        {/* --- TRENDING SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <div className="flex items-center justify-between mb-8 border-b-8 border-black pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">
                Trending <span className="text-neo-accent">Now</span>
              </h2>
            </div>
            <Link 
              href="/trending" 
              className="bg-neo-secondary text-black border-4 border-black px-4 py-2 font-black uppercase shadow-neo-sm hover:-translate-y-1 transition-transform"
            >
              View All
            </Link>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-4 brutal-scroll">
            {/* FIXED: Using 'trending' state instead of 'trendingProducts' */}
            {trending.map((item, i) => (
              <div key={item._id} className="snap-start shrink-0 w-80">
                {renderProductCard(item, i)}
              </div>
            ))}
          </div>
        </section>

        {/* --- ON SALE SECTION --- */}
        {sale.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-24">
            <div className="flex items-center justify-between mb-8 border-b-8 border-black pb-4">
              <div className="flex items-center gap-4">
                <Tag className="h-10 w-10 fill-red-500 text-red-500" />
                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">
                  ON <span className="text-red-500">Sale</span>
                </h2>
              </div>
              <Link 
                href="/onsale" 
                className="bg-red-500 text-white border-4 border-black px-4 py-2 font-black uppercase shadow-neo-sm hover:-translate-y-1 transition-transform"
              >
                View All
              </Link>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 brutal-scroll">
              {sale.map((product, i) => (
                <div key={product._id} className="snap-start shrink-0 w-80">
                  {renderProductCard(product, i)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. MAIN CATALOG & DYNAMIC CONTROLS */}
        <section id="catalog">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Full Inventory</h2>
          </div>

          {/* INTERACTIVE CONTROLS BAR */}
          <div className="bg-white border-4 border-black p-6 shadow-neo-md mb-12 flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
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
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-black text-white p-2 border-2 border-black hidden xl:block">
                <SlidersHorizontal className="h-5 w-5 stroke-[3px]" />
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`border-4 border-black px-4 py-2 font-black text-sm uppercase tracking-wide transition-all duration-100 ${selectedCategory === cat ? "bg-neo-secondary shadow-none translate-x-[2px] translate-y-[2px]" : "bg-white shadow-neo-sm hover:bg-neo-bg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* INVENTORY MAPPING (No Loading Flash!) */}
          {initialBoot ? (
            <div className="text-center py-24 bg-white border-4 border-black max-w-md mx-auto shadow-neo-md rotate-1">
              <div className="text-4xl font-black uppercase tracking-tighter animate-pulse">SYNCHRONIZING...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, i) => renderProductCard(product, i))}
              </div>

              {/* NULL DISCOVERY VALUE BLOCK */}
              {products.length === 0 && (
                <div className="text-center py-20 bg-white border-4 border-black max-w-xl mx-auto shadow-neo-md rotate-[-1deg] mt-8">
                  <p className="font-black text-2xl uppercase">NO MATCHES FOUND IN SYSTEM</p>
                  <p className="font-bold text-black/60 uppercase text-sm mt-2">Try tuning down the variables or query string.</p>
                </div>
              )}

              {/* PAGINATION COMPONENT */}
              {pages > 1 && (
                <Pagination 
                  pages={pages} 
                  page={page} 
                  onPageChange={setCurrentPage} 
                />
              )}
            </>
          )}
        </section>

      </div>

      {/* Global CSS for a Brutalist Custom Scrollbar */}
      <style jsx global>{`
        .brutal-scroll::-webkit-scrollbar {
          height: 14px;
        }
        .brutal-scroll::-webkit-scrollbar-track {
          background: #ffffff;
          border-top: 4px solid black;
          border-bottom: 4px solid black;
        }
        .brutal-scroll::-webkit-scrollbar-thumb {
          background: #000000;
          cursor: pointer;
        }
        .brutal-scroll::-webkit-scrollbar-thumb:hover {
          background: #ef4444; /* red-500 */
        }
      `}</style>
    </main>
  );
}