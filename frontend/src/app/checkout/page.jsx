"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, shippingAddress, saveShippingAddress } = useCartStore();
  const { userInfo } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pre-fill form if they already entered it previously
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");


  // 1. Tell the app it has successfully loaded in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (shippingAddress && Object.keys(shippingAddress).length > 0) {
      setAddress(shippingAddress.address || "");
      setCity(shippingAddress.city || "");
      setPostalCode(shippingAddress.postalCode || "");
      setCountry(shippingAddress.country || "");
    }
  }, [shippingAddress]);

  // 2. ONLY check for the user AFTER the app is mounted and Zustand has loaded
  useEffect(() => {
    if (isMounted && !userInfo) {
      router.push("/login?redirect=/checkout");
    }
  }, [isMounted, userInfo, router]);

  // 3. Show nothing (or a loading spinner) while it figures out who you are
  if (!isMounted) return null;

const cartTotal = cartItems.reduce((acc, item) => {
    const activePrice = item.isSale ? item.salePrice : item.price;
    return acc + (activePrice * item.qty);
  }, 0).toFixed(2);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Save to Zustand
    saveShippingAddress({ address, city, postalCode, country });

    // 2. Talk to the Express Backend to generate a Stripe Session
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/create-checkout-session`,
        {
          orderItems: cartItems,
          shippingAddress: { address, city, postalCode, country },
        },
        config
      );
      window.location.href = data.url;

      // 3. Redirect the browser directly to the secure Stripe portal
      window.location.href = data.url; 
    } catch (error) {
      alert("Failed to initialize payment gateway.");
      setLoading(false);
    }
  };

  if (!isMounted || !userInfo) return null;

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Badge */}
        <div className="inline-block bg-neo-secondary text-black border-4 border-black px-6 py-2 mb-8 -rotate-1 shadow-neo-sm">
          <h1 className="font-black text-2xl uppercase tracking-widest">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT: SHIPPING FORM (8 Cols) */}
          <div className="md:col-span-8">
            <Card className="rotate-1 shadow-neo-md">
              <CardHeader className="bg-white border-b-4 border-black py-6">
                <CardTitle className="text-3xl">DESTINATION PROTOCOL</CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <form onSubmit={submitHandler} className="space-y-6">
                  
                  <div className="space-y-2">
                    <label className="font-bold uppercase tracking-widest text-sm">Street Address</label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 BRUTALIST BLVD" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold uppercase tracking-widest text-sm">City</label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="NEO TOKYO" />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold uppercase tracking-widest text-sm">Postal Code</label>
                      <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="10001" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold uppercase tracking-widest text-sm">Country</label>
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="UNITED STATES" />
                  </div>

                  <Button type="submit" className="w-full text-xl h-16 mt-8 shadow-neo-sm" disabled={loading || cartItems.length === 0}>
                    {loading ? "CONNECTING TO STRIPE..." : "PROCEED TO PAYMENT"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: ORDER SUMMARY (4 Cols) */}
          <div className="md:col-span-4">
            <Card className="-rotate-1 shadow-neo-sm bg-neo-muted border-4 border-black">
              <CardHeader className="border-b-4 border-black p-4 bg-black text-white">
                <CardTitle className="text-xl">SUMMARY</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white space-y-4">
                {cartItems.map((item) => {
                  // Determine the active price for this specific item
                  const activePrice = item.isSale ? item.salePrice : item.price;
                  
                  return (
                    <div key={item._id} className="flex justify-between items-center border-b-2 border-black pb-2">
                      <span className="font-bold uppercase text-sm truncate pr-2">
                        {item.qty}x {item.name}
                      </span>
                      <span className="font-black">${(activePrice * item.qty).toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-4">
                  <span className="font-black uppercase text-xl">TOTAL:</span>
                  <span className="font-black text-3xl text-neo-accent">${cartTotal}</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}