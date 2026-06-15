"use client";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton({ product, showQty = true }) {
  const { addToCart, cartItems, removeFromCart } = useCartStore();
  const [localQty, setLocalQty] = useState(1);
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const currentCartItem = cartItems.find((item) => item._id === product._id);
  const qtyInCart = currentCartItem ? currentCartItem.qty : 0;

  if (!isMounted) {
    // SHRUNK: Heights adjusted for mobile (h-10/h-12) and desktop (h-14/h-16)
    return <Button variant="outline" className={`w-full text-xs sm:text-xl shadow-neo-sm ${showQty ? 'h-12 sm:h-16' : 'h-10 sm:h-14'}`}>LOADING...</Button>;
  }

  if (product.countInStock === 0) {
    return (
      // SHRUNK: Height and text size
      <Button variant="outline" className="w-full text-xs sm:text-xl h-10 sm:h-14 bg-black text-white cursor-not-allowed" disabled>
        SOLD OUT
      </Button>
    );
  }

  // --- HANDLERS FOR WHEN ITEM IS ALREADY IN CART ---
  const handleIncrement = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (qtyInCart < product.countInStock) {
      addToCart(product, 1);
    } else {
      alert(`Whoops! We only have ${product.countInStock} of these in stock.`);
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (qtyInCart === 1) {
      removeFromCart(product._id); 
    } else {
      addToCart(product, -1); 
    }
  };

  // --- HANDLER FOR INITIAL ADD ---
  const handleInitialAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (localQty > product.countInStock) {
      alert(`Whoops! We only have ${product.countInStock} of these in stock.`);
      return;
    }
    addToCart(product, localQty);
  };

  // ==========================================
  // STATE 1: ALREADY IN CART (Morphing Button)
  // ==========================================
  if (qtyInCart > 0) {
    return (
      // SHRUNK: Border width and heights
      <div className={`flex w-full border-[3px] sm:border-4 border-black bg-neo-secondary shadow-neo-sm ${showQty ? 'h-12 sm:h-16' : 'h-10 sm:h-14'}`}>
        
        <button 
          onClick={handleDecrement}
          // SHRUNK: Button width and border
          className="w-10 sm:w-16 flex items-center justify-center hover:bg-white transition-colors border-r-[3px] sm:border-r-4 border-black shrink-0"
        >
          {/* SHRUNK: Icon sizes from h-5/w-5 to h-4/w-4 on mobile */}
          {qtyInCart === 1 ? <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3px]" /> : <Minus className="h-4 w-4 sm:h-5 sm:w-5 stroke-[4px]" />}
        </button>

        {/* SHRUNK: Text size to text-xs on mobile to prevent wrapping/clipping */}
        <div className="flex-grow flex items-center justify-center font-black text-xs sm:text-xl uppercase text-center leading-none px-1">
          {qtyInCart} IN CART
        </div>

        <button 
          onClick={handleIncrement}
          className="w-10 sm:w-16 flex items-center justify-center hover:bg-white transition-colors border-l-[3px] sm:border-l-4 border-black shrink-0"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 stroke-[4px]" />
        </button>
        
      </div>
    );
  }

  // ==========================================
  // STATE 2: NOT IN CART YET (Standard Button)
  // ==========================================
  return (
    <div className="flex gap-2 sm:gap-4 w-full">
      
      {/* Initial Quantity Selector */}
      {showQty && (
        // SHRUNK: Width from w-28 to w-24, border thickness
        <div className="border-[3px] sm:border-4 border-black w-24 sm:w-32 flex items-center justify-between bg-neo-bg shrink-0 shadow-neo-sm">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLocalQty(localQty > 1 ? localQty - 1 : 1); }}
            className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-neo-secondary transition-colors border-r-[3px] sm:border-r-4 border-black"
          >
            <Minus className="h-4 w-4 sm:h-5 sm:w-5 stroke-[4px]" />
          </button>
          
          <span className="font-black text-lg sm:text-2xl">{localQty}</span>
          
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLocalQty(localQty < product.countInStock ? localQty + 1 : product.countInStock); }}
            className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-neo-secondary transition-colors border-l-[3px] sm:border-l-4 border-black"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 stroke-[4px]" />
          </button>
        </div>
      )}

      {/* The Initial Add To Cart Button */}
      <Button 
        variant="default" 
        // SHRUNK: Text to 10px on mobile, heights adjusted, padding reduced
        className={`flex-grow font-black text-[10px] sm:text-lg shadow-neo-sm transition-colors whitespace-normal leading-tight px-1 sm:px-2 ${showQty ? 'h-12 sm:h-16' : 'h-10 sm:h-14 w-full'}`}
        onClick={handleInitialAdd}
      >
        ADD TO CART
      </Button>
      
    </div>
  );
}