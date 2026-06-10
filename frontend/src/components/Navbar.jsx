"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LogOut, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // JWT expiry (exp) is in seconds, Date.now() is in milliseconds
    return (payload.exp * 1000) < Date.now(); 
  } catch (error) {
    return true; // If the token is corrupted, treat it as expired
  }
};

export default function Navbar() {
  const router = useRouter();
  const { userInfo, token, logout } = useAuthStore();
  const { cartItems, toggleCart, clearCart, loadUserCart } = useCartStore(); 

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (token) {
      loadUserCart(); // Instantly pull their saved data when they log in!
    }
  }, [token, loadUserCart]);
  useEffect(() => {
    if (token) {
      // 1. Check if the token is dead
      if (isTokenExpired(token)) {
        console.log("Token expired. Logging user out.");
        logout(); // Wipes their expired data from Zustand and LocalStorage
        router.push("/login"); // Kicks them to the login screen
      } else {
        // 2. If the token is still alive, load their cart!
        loadUserCart(); 
      }
    }
  }, [token, loadUserCart, logout, router]);

  const Logout = () => {
    clearCart(); // Wipes the local browser so the next user sees a blank slate
    logout();
    closeMenu(); // Close the menu if they log out from mobile
    router.push("/login");    
  };
  
  // HYDRATION FIX: Prevent Next.js from panicking about localStorage differences
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate cart count only after the component has safely mounted on the client
  const cartCount = isMounted ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  // The fixed Cart Button (extracted so we can keep it visible on mobile & desktop)
  const CartButton = (
    <Button variant="ghost" size="icon" className="relative cursor-pointer hover:bg-transparent" onClick={() => { toggleCart(); closeMenu(); }}>
      <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 stroke-[3px]" />
      {isMounted && cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-neo-accent border-2 border-black text-xs font-black px-1.5 py-0.5 min-w-[24px] text-center rounded-full shadow-[2px_2px_0px_0px_#000]">
          {cartCount}
        </span>
      )}
    </Button>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-neo-sm relative">
      <div className="container mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="py-1 md:py-2">
          <Link href="/" className="relative flex items-center group" onClick={closeMenu}>
            <div className="bg-neo-secondary border-4 border-black px-3 py-1 group-hover:-rotate-3 transition-transform">
              {/* whitespace-nowrap prevents it from wrapping on tiny screens */}
              <span className="font-black text-xl md:text-2xl uppercase tracking-tighter whitespace-nowrap">SHOP CARTEL</span>
            </div>
          </Link>
        </div>
        
        {/* ACTIONS (CART & AUTH) */}
        <div className="flex items-center gap-2 md:gap-6">
          
          {/* CART: Always visible on both Desktop and Mobile */}
          {CartButton}

          {/* DESKTOP AUTHENTICATION (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4">
            {isMounted && userInfo ? (
              <>
                <Link 
                  href="/profile" 
                  className="font-black text-lg uppercase hover:bg-neo-secondary hover:-rotate-2 transition-all border-2 border-transparent hover:border-black px-2 py-1"
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
              </>
            ) : (
              isMounted && (
                <Button variant="default" asChild>
                  <Link href="/login" className="bg-neo-secondary border-4 border-black px-8 py-2 font-black uppercase shadow-neo-sm hover:-translate-y-1 transition-transform">
                    Log In
                  </Link>
                </Button>
              )
            )}
          </div>

          {/* MOBILE HAMBURGER TOGGLE (Hidden on Desktop) */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="hover:bg-transparent" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-8 w-8 stroke-[3px]" /> : <Menu className="h-8 w-8 stroke-[3px]" />}
            </Button>
          </div>

        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b-4 border-black flex flex-col p-4 gap-4 md:hidden shadow-neo-xl animate-in slide-in-from-top-2 duration-200">
          {isMounted && userInfo ? (
            <>
              <Link 
                href="/profile" 
                onClick={closeMenu}
                className="flex justify-between items-center bg-white border-4 border-black p-4 font-black uppercase text-lg shadow-neo-sm active:translate-y-1"
              >
                Profile <User className="h-6 w-6 stroke-[3px]" />
              </Link>
              
              {userInfo.role === "admin" && (
                <Link 
                  href="/admin" 
                  onClick={closeMenu}
                  className="bg-black text-white border-4 border-black p-4 text-center font-black uppercase text-lg shadow-neo-sm active:translate-y-1"
                >
                  Admin Control
                </Link>
              )}

              <button 
                onClick={Logout} 
                className="bg-neo-accent text-white border-4 border-black p-4 flex justify-between items-center font-black uppercase text-lg shadow-neo-sm active:translate-y-1"
              >
                Log Out <LogOut className="h-6 w-6 stroke-[3px]" />
              </button>
            </>
          ) : (
            isMounted && (
              <Link 
                href="/login" 
                onClick={closeMenu}
                className="bg-neo-secondary border-4 border-black p-4 text-center font-black uppercase text-xl shadow-neo-sm active:translate-y-1"
              >
                Log In
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}