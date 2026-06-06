"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { userInfo, token, logout } = useAuthStore();
  // 2. Grab loadUserCart from the store
  const { cartItems, toggleCart, clearCart, loadUserCart } = useCartStore(); 

  // 3. Add this right above your handleLogout function:
  useEffect(() => {
    if (token) {
      loadUserCart(); // Instantly pull their saved data when they log in!
    }
  }, [token, loadUserCart]);

  const Logout = () => {
    clearCart(); // Wipes the local browser so the next user sees a blank slate
    logout();    
  };
  
  // HYDRATION FIX: Prevent Next.js from panicking about localStorage differences
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate cart count only after the component has safely mounted on the client
  const cartCount = isMounted ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-neo-sm">
      <div className="container mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <Link href="/" className="relative flex items-center group">
          <div className="bg-neo-secondary border-4 border-black px-3 py-1 mr-2 group-hover:-rotate-3 transition-transform">
            <span className="font-black text-xl uppercase tracking-tighter">SHOP</span>
          </div>
          <span className="font-black text-2xl uppercase tracking-tighter text-stroke hidden sm:block">
            CARTEL
          </span>
        </Link>

        {/* ACTIONS (CART & AUTH) */}
        <div className="flex items-center gap-4">
          
          {/* THE FIXED CART BUTTON */}
          <Button variant="ghost" size="icon" className="relative cursor-pointer" onClick={toggleCart}>
            <ShoppingCart className="h-6 w-6 stroke-[3px]" />
            {isMounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-neo-accent border-2 border-black text-xs font-black px-1.5 py-0.5 min-w-[24px] text-center rounded-full shadow-[2px_2px_0px_0px_#000]">
                {cartCount}
              </span>
            )}
          </Button>

          {/* AUTHENTICATION */}
          {isMounted && userInfo ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/profile" 
                className="font-black text-lg uppercase hidden sm:block hover:bg-neo-secondary hover:-rotate-2 transition-all border-2 border-transparent hover:border-black px-2 py-1"
                title="Access User Terminal"
              >
                HI, {userInfo.name}
              </Link>
              {userInfo.role === 'admin' && (
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={Logout} title="Log Out">
                <LogOut className="h-5 w-5 stroke-[3px]" />
              </Button>
            </div>
          ) : (
            isMounted && (
              <Button variant="default" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            )
          )}
        </div>

      </div>
    </nav>
  );
}