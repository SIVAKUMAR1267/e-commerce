"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export default function AdminOrders() {
  const { token, userInfo } = useAuthStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch admin orders");
      }
    };
    if (token && userInfo?.role === 'admin') fetchOrders();
  }, [token, userInfo]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local UI state
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert("Status update failed");
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone py-12 px-4 sm:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="bg-black text-white p-8 border-4 border-black shadow-neo-md">
          <h1 className="text-4xl font-black uppercase tracking-widest">Admin Control // Order Fulfillment</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border-4 border-black p-6 shadow-neo-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div>
                <h3 className="font-black text-xl uppercase tracking-tighter mb-1">ID: {order._id}</h3>
                <p className="font-bold uppercase text-sm text-black/60">
                  User: {order.user?.name} | Total: ${order.totalPrice.toFixed(2)} | Items: {order.orderItems?.length}
                </p>
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <select 
                  className={`border-4 border-black font-black uppercase p-3 w-full md:w-auto outline-none transition-colors ${
                    order.status === 'Delivered' ? 'bg-green-400' : 
                    order.status === 'Shipped' ? 'bg-neo-secondary' : 'bg-neo-accent'
                  }`}
                  value={order.status || 'Processing'}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <a 
                  href={`/order/${order._id}`} 
                  target="_blank" 
                  className="bg-black text-white px-4 py-3 font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-colors"
                >
                  View
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}