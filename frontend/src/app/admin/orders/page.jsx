"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
export default function AdminOrders() {
  const { token, userInfo } = useAuthStore();
  const [orders, setOrders] = useState([]);
  
  // State for the confirmation pop-up
 const [modal, setModal] = useState({ 
    isOpen: false, 
    orderId: null, 
    newStatus: null, 
    currentLocation: "" 
  });

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

  // Triggers the pop-up instead of instantly updating
const handleSelectChange = (order, newStatus) => {
    setModal({ 
      isOpen: true, 
      orderId: order._id, 
      newStatus, 
      currentLocation: order.currentLocation || "SF, US" 
    });
  };
  const confirmStatusChange = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${modal.orderId}/status`,
        { 
          status: modal.newStatus,
          currentLocation: modal.currentLocation 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state so it reflects instantly
      setOrders(orders.map(o => o._id === modal.orderId ? { 
        ...o, 
        status: modal.newStatus, 
        currentLocation: modal.currentLocation 
      } : o));
      
      setModal({ isOpen: false, orderId: null, newStatus: null, currentLocation: "" });
    } catch (error) {
      alert("Status update failed. Check database connection.");
      setModal({ isOpen: false, orderId: null, newStatus: null, currentLocation: "" });
    }
  };
  // Background color mapping for all stages
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-400';
      case 'Out for Delivery': return 'bg-yellow-400';
      case 'Shipped': return 'bg-blue-400';
      case 'Packed': return 'bg-purple-400';
      case 'Cancelled': return 'bg-red-500 text-white';
      default: return 'bg-neo-accent text-white';
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone py-12 px-4 sm:px-12 relative">
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

              <div className="flex items-center gap-4 w-full md:w-auto">
                <select 
                  className={`border-4 border-black font-black uppercase p-3 w-full md:w-auto outline-none cursor-pointer ${getStatusColor(order.status)}`}
                  value={order.status || 'Processing'}
                  onChange={(e) => handleSelectChange(order, e.target.value)}
                >
                  <option value="Pending" className="bg-white text-black">Pending</option>
                  <option value="Processing" className="bg-white text-black">Processing</option>
                  <option value="Packed" className="bg-white text-black">Packed</option>
                  <option value="Shipped" className="bg-white text-black">Shipped</option>
                  <option value="Out for Delivery" className="bg-white text-black">Out for Delivery</option>
                  <option value="Delivered" className="bg-white text-black">Delivered</option>
                  <option value="Cancelled" className="bg-white text-black">Cancelled</option>
               </select>
                <a href={`/order/${order._id}`} target="_blank" className="bg-black text-white px-4 py-3 font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-colors">
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THE CONFIRMATION POP-UP */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white border-8 border-black p-8 shadow-neo-xl max-w-lg w-full rotate-1 animate-in fade-in zoom-in duration-200">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6">
              Confirm Logistics Update
            </h2>
            <p className="font-bold text-lg mb-4 uppercase text-black/80">
              Update Order <span className="text-neo-accent">{modal.orderId.slice(-6)}</span> to <span className="bg-black text-white px-2 py-1">{modal.newStatus}</span>?
            </p>
            
            <div className="mb-8 space-y-2">
              <label className="font-black uppercase tracking-widest text-sm">Current Location</label>
              <Input 
                value={modal.currentLocation} 
                onChange={(e) => setModal({...modal, currentLocation: e.target.value})}
                placeholder="e.g. SF, US"
                className="text-lg font-bold uppercase"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={confirmStatusChange}
                className="flex-1 bg-neo-accent text-white px-6 py-4 font-black text-xl uppercase border-4 border-black hover:bg-black hover:-translate-y-1 transition-all shadow-neo-sm"
              >
                EXECUTE
              </button>
              <button 
                onClick={() => setModal({ isOpen: false, orderId: null, newStatus: null, currentLocation: "" })}
                className="flex-1 bg-white text-black px-6 py-4 font-black text-xl uppercase border-4 border-black hover:bg-neo-bg hover:-translate-y-1 transition-all shadow-neo-sm"
              >
                ABORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}