"use client";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton({ product, showQty = true }) {
  // We added removeFromCart here so we can delete the item if they click minus on qty 1
  const { addToCart, cartItems, removeFromCart } = useCartStore();
  const [localQty, setLocalQty] = useState(1);
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const currentCartItem = cartItems.find((item) => item._id === product._id);
  const qtyInCart = currentCartItem ? currentCartItem.qty : 0;

  if (!isMounted) {
    return <Button variant="outline" className={`w-full text-xl shadow-neo-sm ${showQty ? 'h-16' : 'h-14'}`}>LOADING...</Button>;
  }

  if (product.countInStock === 0) {
    return (
      <Button variant="outline" className="w-full text-xl h-14 bg-black text-white cursor-not-allowed" disabled>
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
      removeFromCart(product._id); // Delete it entirely if they subtract from 1
    } else {
      addToCart(product, -1); // Subtract 1 from the cart
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
      <div className={`flex w-full border-4 border-black bg-neo-secondary shadow-neo-sm ${showQty ? 'h-16' : 'h-14'}`}>
        
        <button 
          onClick={handleDecrement}
          className="w-12 sm:w-16 flex items-center justify-center hover:bg-white transition-colors border-r-4 border-black"
        >
          {/* Show a trash can if clicking this will remove the item entirely */}
          {qtyInCart === 1 ? <Trash2 className="h-5 w-5 stroke-[3px]" /> : <Minus className="h-5 w-5 stroke-[4px]" />}
        </button>

        <div className="flex-grow flex items-center justify-center font-black text-lg sm:text-xl uppercase">
          {qtyInCart} IN CART
        </div>

        <button 
          onClick={handleIncrement}
          className="w-12 sm:w-16 flex items-center justify-center hover:bg-white transition-colors border-l-4 border-black"
        >
          <Plus className="h-5 w-5 stroke-[4px]" />
        </button>
        
      </div>
    );
  }

  // ==========================================
  // STATE 2: NOT IN CART YET (Standard Button)
  // ==========================================
  return (
    <div className="flex gap-3 sm:gap-4 w-full">
      
      {/* Initial Quantity Selector (Only shows on Product Detail Page) */}
      {showQty && (
        <div className="border-4 border-black w-28 sm:w-32 flex items-center justify-between bg-neo-bg shrink-0 shadow-neo-sm">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLocalQty(localQty > 1 ? localQty - 1 : 1); }}
            className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-neo-secondary transition-colors border-r-4 border-black"
          >
            <Minus className="h-5 w-5 stroke-[4px]" />
          </button>
          
          <span className="font-black text-xl sm:text-2xl">{localQty}</span>
          
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLocalQty(localQty < product.countInStock ? localQty + 1 : product.countInStock); }}
            className="w-8 sm:w-10 h-full flex items-center justify-center hover:bg-neo-secondary transition-colors border-l-4 border-black"
          >
            <Plus className="h-5 w-5 stroke-[4px]" />
          </button>
        </div>
      )}

      {/* The Initial Add To Cart Button */}
      <Button 
        variant="default" 
        className={`flex-grow font-black text-sm sm:text-lg shadow-neo-sm transition-colors whitespace-normal leading-tight px-2 ${showQty ? 'h-16' : 'h-14 w-full'}`}
        onClick={handleInitialAdd}
      >
        ADD TO CART
      </Button>
      
    </div>
  );
}