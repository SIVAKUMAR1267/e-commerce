"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Package, Truck, CheckCircle, Clock, Box, MapPin, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrder();
  }, [id, token]);

  if (loading) return <div className="p-12 text-2xl font-black uppercase text-center animate-pulse">Scanning Network...</div>;
  if (!order) return <div className="p-12 text-2xl font-black uppercase text-center">Order Not Found</div>;

const statusMap = {
  Pending: { icon: Clock, color: "bg-gray-300" },
  Processing: { icon: Clock, color: "bg-neo-accent" },
  Packed: { icon: Box, color: "bg-purple-400" },
  Shipped: { icon: Truck, color: "bg-blue-400" },
  'Out for Delivery': { icon: MapPin, color: "bg-yellow-400" },
  Delivered: { icon: CheckCircle, color: "bg-green-400" },
  Cancelled: { icon: XCircle, color: "bg-red-500 text-white" },
};
  const CurrentIcon = statusMap[order.status || 'Processing'].icon;

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="bg-white border-8 border-black p-8 shadow-neo-md rotate-[1deg]">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Manifest: {order._id}</h1>
          <p className="font-bold text-black/60 uppercase">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Brutalist Timeline / Status Tracker */}
        <div className={`border-8 border-black p-8 shadow-neo-md rotate-[-1deg] transition-colors duration-500 ${statusMap[order.status || 'Processing'].color}`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white border-4 border-black p-4 rounded-full shadow-neo-sm animate-bounce">
                <CurrentIcon className="h-10 w-10 stroke-[3px]" />
              </div>
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">
                    {order.status}
                  </h2>
                  <p className="font-bold uppercase tracking-widest text-black/70 mt-1">
                    {/* The dynamic location renders here */}
                    Current Location: <span className="text-black font-black">{order.currentLocation || 'SF, US'}</span>
                  </p>
              </div>
            </div>
            <div className="bg-black text-white px-6 py-4 font-black text-2xl border-4 border-white shadow-neo-sm">
              TOTAL: ${order.totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="bg-white border-8 border-black p-8 shadow-neo-md space-y-4">
          <h3 className="font-black text-xl uppercase tracking-widest border-b-4 border-black pb-4 mb-4">Hardware Acquired</h3>
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b-2 border-black/10 pb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-200 border-2 border-black flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <span className="font-bold uppercase">{item.name} x {item.qty}</span>
              </div>
              <span className="font-black">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}