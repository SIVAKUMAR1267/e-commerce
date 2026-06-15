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

// Responsive Product Card (Scales down cleanly on mobile for 2 columns)
  const renderProductCard = (product, i) => (
    <div key={product._id} className="relative group w-full">
      <Link href={`/product/${product._id}`} className="block">
        <Card hoverLift className={i % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]"}>
          {/* Shrink image height specifically for mobile */}
          <div className="relative w-full h-36 sm:h-64 border-b-2 sm:border-b-4 border-black bg-white overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-neo-secondary border-2 sm:border-4 border-black px-1.5 py-0.5 sm:px-2 sm:py-1 font-black text-[9px] sm:text-xs uppercase shadow-neo-sm">
              {product.category}
            </div>
            {product.isSale && (
               <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white border-2 sm:border-4 border-black px-1.5 py-0.5 sm:px-2 sm:py-1 font-black text-[9px] sm:text-xs uppercase shadow-neo-sm animate-pulse">
                 SALE
               </div>
            )}
          </div>
          {/* Card padding and text shrinks on mobile to prevent ugly text wrapping */}
          <CardContent className="p-2 sm:p-6">
            <h2 className="text-xs sm:text-xl font-black uppercase tracking-tight leading-tight mb-1 truncate">{product.name}</h2>
            <p className="font-bold text-black/60 uppercase text-[9px] sm:text-xs tracking-widest mb-2 sm:mb-4">{product.brand}</p>
            <div className="text-sm sm:text-2xl font-black tracking-tighter">
              {product.isSale ? (
                <div className="flex flex-col xl:flex-row xl:items-center xl:gap-2">
                  <span className="line-through text-black/40 text-[10px] sm:text-base">${product.price.toFixed(2)}</span>
                  <span className="text-red-500">${product.salePrice?.toFixed(2) || (product.price * 0.8).toFixed(2)}</span>
                </div>
              ) : (
                `$${product.price.toFixed(2)}`
              )}
            </div>
          </CardContent>
          <CardFooter className="pb-2 px-2 sm:pb-6 sm:px-6 relative z-20">
            <AddToCartButton product={product} showQty={false} />
          </CardFooter>
        </Card>
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-neo-bg bg-halftone pb-24 overflow-hidden">
      
     {/* 1. THE HERO ZONE (MOBILE STACKED OPTIMIZED) */}
      <section className={`relative border-b-8 border-black transition-colors duration-700 overflow-hidden ${heroSlides[currentSlide].bg} ${heroSlides[currentSlide].text}`}>
        
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none mix-blend-overlay" />

        {/* MANUAL ARROWS */}
        {/* MANUAL ARROWS (Hidden on mobile to prevent viewport blowout) */}
        <button onClick={prevSlide} className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white text-black border-y-4 border-r-4 border-black px-1 py-6 sm:px-2 sm:py-8 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:pr-4 hover:bg-neo-accent transition-all text-xs sm:text-base">
          &lt;&lt;
        </button>
        <button onClick={nextSlide} className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white text-black border-y-4 border-l-4 border-black px-1 py-6 sm:px-2 sm:py-8 font-black shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] hover:pl-4 hover:bg-neo-accent transition-all text-xs sm:text-base">
          &gt;&gt;
        </button>

        {/* FLEX-COL ON MOBILE, FLEX-ROW ON DESKTOP, INCREASED PADDING */}
       <div className="max-w-7xl mx-auto px-4 sm:px-16 lg:px-24 py-6 sm:py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-6 lg:gap-16 relative z-10">
          
          <div key={currentSlide} className="w-full lg:w-1/2 space-y-4 sm:space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">

            <div className={`inline-flex items-center gap-2 bg-white text-black border-2 sm:border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 font-black uppercase text-xs sm:text-sm tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1`}>
              {heroSlides[currentSlide].icon} {heroSlides[currentSlide].badge}
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              {heroSlides[currentSlide].title1}<br />
              <span className={`text-transparent ${heroSlides[currentSlide].stroke}`}>
                {heroSlides[currentSlide].title2} 
              </span><br />
              <span className={`${heroSlides[currentSlide].accent} px-2 sm:px-4 inline-block rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-2 border-2 sm:border-4 border-black text-3xl sm:text-6xl lg:text-7xl`}>
                {heroSlides[currentSlide].titleAccent}
              </span>
            </h1>

            <p className="text-xs sm:text-xl font-bold w-full lg:max-w-lg leading-snug bg-white/10 backdrop-blur-md p-2 sm:p-4 border-l-[3px] sm:border-l-8 border-current">
              {heroSlides[currentSlide].desc}
            </p>

            <Button 
              size="lg" 
              className="text-base sm:text-xl h-14 sm:h-16 px-6 sm:px-8 group rotate-[-1deg] hover:rotate-1 bg-black text-white hover:bg-white hover:text-black border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto" 
              onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
            >
              INITIATE <ArrowDown className="ml-2 h-5 w-5 sm:h-6 sm:w-6 stroke-[3px] group-hover:translate-y-2 transition-transform" />
            </Button>
          </div>

          {/* RIGHT: THE DISCOUNT TICKET (Now naturally stacked on mobile instead of absolute) */}
         <div className="relative flex justify-center lg:justify-end items-center w-[95%] sm:max-w-sm lg:max-w-none lg:w-1/2 mx-auto lg:ml-auto z-20 mt-2 sm:mt-6 lg:mt-0">
            
            <div className={`absolute inset-0 border-8 border-black ${heroSlides[currentSlide].boxBg} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3 transition-colors duration-700`} />
            
            <div className="relative w-full border-[3px] sm:border-8 border-black bg-white -rotate-1 p-3 sm:p-8 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black gap-3 sm:gap-6">
              
              <div className="border-b-4 border-black pb-3 flex justify-between items-center">
                <span className="font-black tracking-widest uppercase text-sm sm:text-base">SYS_OFFER</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[10px] uppercase text-red-500 tracking-widest hidden sm:block">Live</span>
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                </div>
              </div>
              
              <div className="text-center py-1 sm:py-4">
                <div className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-1">
                  40%
                </div>
                <div className="text-sm sm:text-2xl font-black tracking-widest uppercase bg-black text-white inline-block px-2 py-1 sm:px-4 sm:py-1 -rotate-2 border-2 border-transparent">
                  OFF HAUL
                </div>
              </div>
              
              <div className="bg-neo-accent border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
                <span className="font-bold text-xs sm:text-sm uppercase block leading-none mb-2 text-black/80">Use Code at Checkout</span>
                <span className="font-black text-2xl sm:text-3xl uppercase tracking-widest leading-none group-active:scale-95 transition-transform inline-block">
                  BRUTAL
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. RUNNING TEXT MARQUEE */}
      <div className="bg-black text-white border-b-[3px] sm:border-b-4 border-black py-2 sm:py-4 flex overflow-hidden w-full whitespace-nowrap">
        {/* We render two identical blocks side-by-side that translate left continuously */}
        <div className="flex shrink-0 animate-marquee gap-6 sm:gap-16 px-3 sm:px-8 items-center font-black uppercase text-xs sm:text-2xl tracking-widest">
          <span>⚡ NEW ERA PRODUCTS DROP EVERY SUNDAY</span>
          <span>⚡ FREE GLOBAL SHIPPING OVER $100</span>
          <span>⚡ 100% SECURE CUSTOM PAYMENT NETWORKS</span>
        </div>
        <div aria-hidden="true" className="flex shrink-0 animate-marquee gap-6 sm:gap-16 px-3 sm:px-8 items-center font-black uppercase text-xs sm:text-2xl tracking-widest">
          <span>⚡ NEW ERA PRODUCTS DROP EVERY SUNDAY</span>
          <span>⚡ FREE GLOBAL SHIPPING OVER $100</span>
          <span>⚡ 100% SECURE CUSTOM PAYMENT NETWORKS</span>
        </div>
      </div>

      <div className="w-full mx-auto pt-12 sm:pt-16 space-y-16 sm:space-y-24 overflow-hidden sm:overflow-visible">
        
        {/* --- TRENDING SECTION --- */}
        <section className="max-w-7xl mx-auto px-3 sm:px-12 w-full">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 border-b-[3px] sm:border-b-8 border-black pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
                Trending <span className="text-neo-accent">Now</span>
              </h2>
            </div>
            <Link 
              href="/trending" 
              className="bg-neo-secondary text-black border-[3px] sm:border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base font-black uppercase shadow-neo-sm hover:-translate-y-1 transition-transform"
            >
              View All
            </Link>
          </div>

          {/* Clean 2-column mobile grid mapping */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 w-full min-w-0">
            {trending.slice(0, 4).map((item, i) => renderProductCard(item, i))}
          </div>
        </section>

        {/* --- ON SALE SECTION --- */}
        {sale.length > 0 && (
          <section className="max-w-7xl mx-auto px-3 sm:px-12 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 border-b-[3px] sm:border-b-8 border-black pb-3 sm:pb-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <Tag className="h-6 w-6 sm:h-10 sm:w-10 fill-red-500 text-red-500" />
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
                  ON <span className="text-red-500">Sale</span>
                </h2>
              </div>
              <Link 
                href="/onsale" 
                className="bg-red-500 text-white border-[3px] sm:border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base font-black uppercase shadow-neo-sm hover:-translate-y-1 transition-transform"
              >
                View All
              </Link>
            </div>
            
            {/* Clean 2-column mobile grid mapping */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 w-full min-w-0">
              {sale.slice(0, 4).map((product, i) => renderProductCard(product, i))}
            </div>
          </section>
        )}

        {/* 3. MAIN CATALOG & DYNAMIC CONTROLS */}
        {/* FIX: Wrapped entire section in w-full, max-w-7xl, and applied responsive horizontal padding (px-4 to px-12) */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-12 w-full mb-12 sm:mb-24">
          
          <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 border-b-[3px] sm:border-b-8 border-black pb-3 sm:pb-4">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">Full Inventory</h2>
          </div>

          {/* INTERACTIVE CONTROLS BAR */}
          {/* FIX: Responsive internal padding (p-3), margins (mb-8), and border thickness for mobile */}
          <div className="bg-white border-[3px] sm:border-4 border-black p-3 sm:p-6 shadow-neo-sm sm:shadow-neo-md mb-8 sm:mb-12 flex flex-col lg:flex-row gap-4 sm:gap-6 justify-between items-stretch lg:items-center w-full">
            
            <div className="relative flex-grow max-w-xl w-full">
              <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-6 w-6 stroke-[3px] text-black" />
              </div>
              {/* FIX: Shrunk input height and text size specifically for mobile screens */}
              <Input 
                type="text" 
                placeholder="SEARCH SYSTEM INVENTORY..." 
                className="pl-10 sm:pl-12 font-bold uppercase border-[2px] sm:border-4 border-black h-10 sm:h-12 text-xs sm:text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="bg-black text-white p-2 border-2 border-black hidden xl:block">
                <SlidersHorizontal className="h-5 w-5 stroke-[3px]" />
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  // FIX: Reduced padding and font-size (text-[10px]) so filter buttons fit cleanly side-by-side on mobile
                  className={`border-[2px] sm:border-4 border-black px-2 py-1.5 sm:px-4 sm:py-2 font-black text-[10px] sm:text-sm uppercase tracking-wide transition-all duration-100 ${
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

          {/* INVENTORY MAPPING (No Loading Flash!) */}
          {initialBoot ? (
            <div className="text-center py-16 sm:py-24 bg-white border-[3px] sm:border-4 border-black max-w-[280px] sm:max-w-md mx-auto shadow-neo-md rotate-1">
              <div className="text-2xl sm:text-4xl font-black uppercase tracking-tighter animate-pulse">SYNCHRONIZING...</div>
            </div>
          ) : (
            <>
              {/* FIX: The grid now perfectly aligns with the search bar above it, strictly enforcing 2 columns on mobile */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8 w-full min-w-0">
                {products.map((product, i) => renderProductCard(product, i))}
              </div>

              {/* NULL DISCOVERY VALUE BLOCK */}
              {products.length === 0 && (
                <div className="text-center py-12 sm:py-20 bg-white border-[3px] sm:border-4 border-black w-full max-w-xl mx-auto shadow-neo-md rotate-[-1deg] mt-8">
                  <p className="font-black text-lg sm:text-2xl uppercase px-4">NO MATCHES FOUND IN SYSTEM</p>
                  <p className="font-bold text-black/60 uppercase text-xs sm:text-sm mt-2 px-4">Try tuning down the variables or query string.</p>
                </div>
              )}

              {/* PAGINATION COMPONENT */}
              {pages > 1 && (
                <div className="mt-8 sm:mt-12 flex justify-center w-full">
                  <Pagination 
                    pages={pages} 
                    page={page} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
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
          @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </main>
  );
}