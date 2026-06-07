"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User as UserIcon, Package } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo, token } = useAuthStore();
  const { shippingAddress, saveShippingAddress } = useCartStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState(null);
  const [orders, setOrders] = useState([]); // State to hold user's orders

  // Local state for the address form
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // 1. Mount & Auth Check
  useEffect(() => {
    setIsMounted(true);
    if (!userInfo) {
      router.push("/login");
    } else if (shippingAddress) {
      setFormData({
        address: shippingAddress.address || "",
        city: shippingAddress.city || "",
        postalCode: shippingAddress.postalCode || "",
        country: shippingAddress.country || "",
      });
    }
  }, [userInfo, router, shippingAddress]);

  // 2. Fetch User's Order History
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch order history");
      }
    };
    if (token) fetchMyOrders();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress(formData);
    setMessage({ type: "success", text: "ADDRESS PROTOCOL UPDATED!" });
    setTimeout(() => setMessage(null), 3000);
  };

  if (!isMounted || !userInfo) return null;

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Badge */}
        <div className="inline-block bg-black text-white border-4 border-black px-6 py-2 -rotate-1 shadow-neo-sm">
          <h1 className="font-black text-2xl uppercase tracking-widest">User Terminal</h1>
        </div>

        {/* TOP ROW: IDENTITY AND ADDRESS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT: STATIC IDENTITY CARD */}
          <div className="md:col-span-1">
            <Card className="rotate-1 shadow-neo-sm bg-neo-secondary border-4 border-black h-full">
              <CardHeader className="border-b-4 border-black p-6 bg-white flex flex-row items-center gap-4">
                <UserIcon className="h-8 w-8 stroke-[3px]" />
                <CardTitle className="text-2xl uppercase">Identity</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="font-bold text-black/60 uppercase text-xs tracking-widest">Designation</label>
                  <p className="font-black text-xl uppercase truncate">{userInfo.name}</p>
                </div>
                <div>
                  <label className="font-bold text-black/60 uppercase text-xs tracking-widest">Comms Link</label>
                  <p className="font-bold text-lg truncate">{userInfo.email}</p>
                </div>
                <div>
                  <label className="font-bold text-black/60 uppercase text-xs tracking-widest">Clearance</label>
                  <p className="font-black text-lg uppercase px-2 py-1 bg-black text-white inline-block mt-1">
                    {userInfo.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: ADDRESS EDITOR */}
          <div className="md:col-span-2">
            <Card className="-rotate-1 shadow-neo-md border-4 border-black">
              <CardHeader className="border-b-4 border-black p-6 flex flex-row items-center gap-4 bg-white">
                <MapPin className="h-8 w-8 stroke-[3px]" />
                <CardTitle className="text-2xl uppercase">Default Destination</CardTitle>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                {message && (
                  <div className={`mb-6 p-4 font-black text-lg uppercase text-center border-4 border-black shadow-neo-sm ${message.type === 'success' ? 'bg-green-400' : 'bg-neo-accent text-white'}`}>
                    {message.text}
                  </div>
                )}
                <form onSubmit={submitHandler} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-bold uppercase tracking-widest text-sm">Street Address</label>
                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="123 BRUTALIST BLVD" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold uppercase tracking-widest text-sm">City</label>
                      <Input name="city" value={formData.city} onChange={handleChange} placeholder="NEO TOKYO" required />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold uppercase tracking-widest text-sm">Postal Code</label>
                      <Input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="10001" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold uppercase tracking-widest text-sm">Country</label>
                    <Input name="country" value={formData.country} onChange={handleChange} placeholder="UNITED STATES" required />
                  </div>
                  <Button type="submit" className="w-full text-xl h-16 mt-4 shadow-neo-sm">
                    UPDATE DESTINATION PROTOCOL
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM ROW: ORDER HISTORY */}
        <div className="bg-neo-accent border-8 border-black p-8 shadow-neo-md rotate-[1deg]">
          <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-4 mb-6 flex items-center gap-4 text-white">
            <Package className="h-8 w-8 stroke-[3px]" /> Order History
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-white border-4 border-black p-6 font-bold uppercase text-center">
              No active manifests found.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border-4 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-neo-sm hover:-translate-y-1 transition-transform">
                  <div>
                    <p className="font-black uppercase tracking-tight">ID: {order._id}</p>
                    <p className="font-bold text-sm text-black/70 uppercase">
                      Placed: {new Date(order.createdAt).toLocaleDateString()} | Total: ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className={`px-3 py-1 font-black uppercase text-sm border-2 border-black ${
                      order.status === 'Delivered' ? 'bg-green-400' : 
                      order.status === 'Shipped' ? 'bg-neo-secondary' : 'bg-neo-bg'
                    }`}>
                      {order.status || 'Processing'}
                    </span>
                    <Link href={`/order/${order._id}`} className="bg-black text-white px-6 py-2 font-black uppercase text-sm border-4 border-black hover:bg-white hover:text-black transition-colors text-center flex-grow md:flex-grow-0">
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}