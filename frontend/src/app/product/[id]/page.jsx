import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddToCartButton from "@/components/AddToCartButton"; // <-- Import the new button
// Server-side data fetching
async function getProduct(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      cache: "no-store",
    });
    if (res.ok) return res.json();
  } catch (error) {
    console.error("Fetch failed", error);
  }
  return null;
}

// 1. We create a dictionary of our mock products so they match the homepage perfectly
const MOCK_PRODUCTS = {
  '1': { _id: '1', name: 'Vintage High-Tops', brand: 'Kicks', category: 'Shoes', price: 120.00, description: "Thick canvas, heavy rubber soles, and sharp contrast stitching. Built for the streets and designed to get scuffed up.", countInStock: 5 },
  '2': { _id: '2', name: 'Graphic Heavy Tee', brand: 'Streetwear Cartel', category: 'Apparel', price: 45.00, description: "A heavyweight, ultra-durable cotton tee. Boxy fit, dropped shoulders, and a raw hem. This isn't your standard corporate merch—it's built to survive a mosh pit.", countInStock: 10 },
  '3': { _id: '3', name: 'Mechanical Keyboard', brand: 'TechCo', category: 'Electronics', price: 150.00, description: "Loud, tactile, and heavy. Features raw aluminum casing and industrial hot-swappable switches. Every keystroke sounds like a typewriter.", countInStock: 2 },
  '4': { _id: '4', name: 'Retro Skateboard', brand: 'Decked', category: 'Sports', price: 85.00, description: "7-ply maple deck with high-contrast graphic prints. Comes with grip tape as rough as asphalt. Ready to shred.", countInStock: 0 }, // Notice this one is out of stock!
};

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  
  // Try to get the real product from the database
  let product = await getProduct(resolvedParams.id);

  // If it fails (because the DB is empty or the ID is fake), use the matching mock data
  if (!product) {
    // Look up the product by ID, fallback to '2' if it's completely unknown
    product = MOCK_PRODUCTS[resolvedParams.id] || MOCK_PRODUCTS['2'];
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neo-bg bg-grid-pattern py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <Button variant="outline" asChild className="mb-8 -rotate-1 hover:rotate-0">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5 stroke-[3px]" />
            Back to Shop
          </Link>
        </Button>

        {/* Asymmetric 60/40 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Massive Image Frame */}
          <div className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-neo-muted translate-x-4 translate-y-4 border-4 border-black shadow-neo-md"></div>
            
            <div className="relative bg-white border-4 border-black aspect-square flex items-center justify-center shadow-neo-sm z-10 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-6 -left-6 bg-neo-secondary border-4 border-black px-4 py-2 rotate-[-12deg] shadow-neo-sm">
                <span className="font-black text-xl uppercase tracking-widest">{product.brand}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-8 pt-4">
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-black text-white px-3 py-1 font-bold text-xs uppercase tracking-widest border-2 border-black">
                  {product.category}
                </span>
                {product.countInStock > 0 ? (
                  <span className="bg-neo-secondary text-black px-3 py-1 font-bold text-xs uppercase tracking-widest border-2 border-black">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-neo-accent text-white px-3 py-1 font-bold text-xs uppercase tracking-widest border-2 border-black">
                    Sold Out
                  </span>
                )}
              </div>

              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6 text-stroke">
                {product.name}
              </h1>

              <div className="inline-block bg-neo-accent border-4 border-black px-6 py-3 shadow-neo-sm rotate-2 mb-6">
                <span className="font-black text-4xl sm:text-5xl tracking-tighter text-black">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-none p-6">
              <h3 className="font-black uppercase text-xl border-b-4 border-black pb-2 mb-4 flex items-center gap-2">
                <Star className="fill-black h-5 w-5" />
                The Details
              </h3>
              <p className="font-bold text-lg leading-snug">
                {product.description}
              </p>
            </Card>

            {/* Interaction Area */}
            <div className="bg-white border-4 border-black p-6 shadow-neo-sm">
              <div className="flex gap-4 mb-4">
                
                {/* Notice we removed the static '1' div entirely! */}
                {/* The component below now handles both the quantity AND the button */}
                <AddToCartButton product={product} showQty={true} />

              </div>
              <p className="text-center font-bold text-sm text-black/60 uppercase">
                Free shipping on orders over $100
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}