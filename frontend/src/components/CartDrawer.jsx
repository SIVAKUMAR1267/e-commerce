"use client";
import { useState, useEffect } from "react";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const router = useRouter();
  // We added addToCart here so we can increment/decrement items directly!
  const { isCartOpen, toggleCart, cartItems, removeFromCart, addToCart } = useCartStore();
  
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isCartOpen) return null;

const cartTotal = isMounted 
    ? cartItems.reduce((acc, item) => {
        // Decide which price to use before multiplying by quantity
        const activePrice = item.isSale ? item.salePrice : item.price;
        return acc + (activePrice * item.qty);
      }, 0).toFixed(2) 
    : "0.00";

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={toggleCart} />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-neo-bg border-l-8 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col transform transition-transform duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-neo-secondary">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Your Haul</h2>
          <Button variant="outline" size="icon" onClick={toggleCart} className="bg-white">
            <X className="h-6 w-6 stroke-[3px]" />
          </Button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-grid-pattern">
          {!isMounted || cartItems.length === 0 ? (
            <div className="text-center mt-10 bg-white border-4 border-black p-6 rotate-1">
              <p className="font-black text-xl uppercase">Cart is Empty.</p>
              <p className="font-bold text-black/60 uppercase text-sm mt-2">Go buy something loud.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex gap-4 bg-white border-4 border-black p-4 shadow-neo-sm">
                
                <div className="w-20 h-20 border-2 border-black -rotate-2 overflow-hidden shrink-0 bg-white shadow-neo-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  
                  {/* Top Row: Title & Trash */}
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-black uppercase text-lg leading-tight">{item.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-neo-accent hover:text-black transition-colors shrink-0"
                    >
                      <Trash2 className="h-5 w-5 stroke-[3px]" />
                    </button>
                  </div>

                  {/* Bottom Row: Quantity Controls & Price */}
                  <div className="flex items-end justify-between mt-2">
                    
                    {/* NEW: Interactive Quantity Stepper */}
                    <div className="flex items-center border-2 border-black bg-neo-bg shadow-neo-sm h-8">
                      <button 
                        onClick={() => item.qty > 1 ? addToCart(item, -1) : removeFromCart(item._id)}
                        className="w-8 h-full flex items-center justify-center hover:bg-neo-secondary border-r-2 border-black transition-colors"
                      >
                        <Minus className="h-4 w-4 stroke-[3px]" />
                      </button>
                      
                      <span className="font-black w-8 text-center">{item.qty}</span>
                      
                      <button 
                        onClick={() => item.qty < item.countInStock ? addToCart(item, 1) : alert(`Only ${item.countInStock} in stock!`)}
                        className="w-8 h-full flex items-center justify-center hover:bg-neo-secondary border-l-2 border-black transition-colors"
                      >
                        <Plus className="h-4 w-4 stroke-[3px]" />
                      </button>
                    </div>

                    <div className="text-xl font-black">
                      {item.isSale ? (
                        <div className="flex flex-col">
                          <span className="line-through text-black/40 text-sm">${item.price.toFixed(2)}</span>
                          <span className="text-red-500">${item.salePrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        `$${item.price.toFixed(2)}`
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER / CHECKOUT */}
        <div className="p-6 border-t-4 border-black bg-white">
          <div className="flex justify-between items-center mb-6">
            <span className="font-black uppercase text-xl">Total:</span>
            {/* The instantly reacting total! */}
            <span className="font-black text-4xl">${cartTotal}</span>
          </div>
          <Button 
            className="w-full text-xl h-16" 
            disabled={!isMounted || cartItems.length === 0}
            onClick={() => {
              toggleCart(); // Close the drawer
              router.push("/checkout"); // Send to checkout page
            }}
          >
            CHECKOUT
          </Button>
        </div>
      </div>
    </>
  );
}