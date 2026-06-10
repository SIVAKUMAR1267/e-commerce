"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id"); 
  
  const { token } = useAuthStore();
  const { cartItems, shippingAddress, clearCart } = useCartStore();
  
  const [error, setError] = useState(false);
  const hasProcessed = useRef(false); 

  useEffect(() => {
    const saveOrderToDatabase = async () => {
      if (!sessionId) {
        router.push("/");
        return;
      }

      if (cartItems.length === 0) {
        router.push("/profile");
        return;
      }

      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const fallbackSubtotal = cartItems.reduce((acc, item) => acc + (item.isSale ? item.salePrice : item.price) * item.qty, 0);

        // Submit the order payload and let the backend do the heavy lifting
        const { data: createdOrder } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            orderItems: cartItems,
            shippingAddress,
            paymentMethod: "Stripe",
            taxPrice: Number((0.15 * fallbackSubtotal).toFixed(2)), 
            shippingPrice: fallbackSubtotal > 100 ? 0 : 10,
            stripeSessionId: sessionId, // <-- Pass the session token directly here!
          },
          config
        );

        // Clear client side Zustand / Local Storage instantly
        clearCart();

        // Bounce directly to the new order route tracking panel
        router.push(`/order/${createdOrder._id}`);

      } catch (err) {
        console.error("Failed to save order to database", err);
        setError(true);
      }
    };

    if (token && sessionId && cartItems.length > 0) {
      saveOrderToDatabase();
    }
  }, [cartItems, shippingAddress, token, sessionId, router, clearCart]);

  if (error) {
    return (
      <div className="min-h-screen bg-neo-bg bg-halftone flex items-center justify-center p-6">
        <div className="bg-white border-8 border-black p-12 shadow-neo-xl rotate-[1deg] text-center max-w-lg w-full">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-neo-accent mb-4">SYSTEM ERROR</h1>
          <p className="font-bold uppercase mb-6">Payment succeeded, but database sync failed. Please contact support.</p>
          <button onClick={() => router.push('/profile')} className="bg-black text-white px-8 py-4 font-black uppercase border-4 border-black hover:bg-white hover:text-black">
            RETURN TO PROFILE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone flex items-center justify-center p-6">
      <div className="bg-neo-secondary border-8 border-black p-12 shadow-neo-xl rotate-[-1deg] text-center max-w-lg w-full animate-pulse">
        <CheckCircle className="h-24 w-24 mx-auto mb-6 stroke-[3px]" />
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">PAYMENT CLEARED</h1>
        <p className="font-bold text-lg uppercase mb-2 text-black/70">
          Syncing transaction to the global manifest...
        </p>
        <p className="font-black text-sm uppercase tracking-widest">DO NOT CLOSE THIS WINDOW</p>
      </div>
    </div>
  );
}