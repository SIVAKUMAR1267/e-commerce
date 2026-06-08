"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { cartItems, shippingAddress, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // We use a ref to prevent React Strict Mode from firing this twice and creating 2 orders!
  const hasProcessed = useRef(false); 

  useEffect(() => {
    const saveOrderToDatabase = async () => {
      // 1. If the cart is already empty, they probably refreshed the success page. 
      // Send them to their profile so we don't create a blank duplicate order.
      if (cartItems.length === 0) {
        router.push("/profile");
        return;
      }

      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        // 2. Calculate the financial totals the database expects
        const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
        const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% tax example
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        // 3. Fire the payload to our existing POST /api/orders route!
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            orderItems: cartItems,
            shippingAddress,
            paymentMethod: "Stripe",
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 4. Success! Clear their local browser cart so they don't buy it again
        clearCart();

        // 5. Instantly bounce them to their new live tracking page
        router.push(`/order/${data._id}`);

      } catch (err) {
        console.error("Failed to save order to database", err);
        setError(true);
        setLoading(false);
      }
    };

    if (token) {
      saveOrderToDatabase();
    }
  }, [cartItems, shippingAddress, token, router, clearCart]);

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