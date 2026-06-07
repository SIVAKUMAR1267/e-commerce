"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ADDED: Missing Link import
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Package } from "lucide-react"; // ADDED: Missing Package icon

export default function AdminDashboard() {
  const router = useRouter();
  const { userInfo, token } = useAuthStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // ADDED: Missing Orders state!
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { name: "", brand: "", category: "", price: "", countInStock: "", image: "", description: "" };
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    if (userInfo && userInfo.role !== "admin") {
      router.push("/");
    } else if (userInfo) {
      fetchProducts();
    }
  }, [userInfo, router]);

  // FIX: Admin needs to fetch ALL orders, not just "myorders"
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch all orders");
      }
    };
    if (token && userInfo?.role === "admin") fetchAllOrders();
  }, [token, userInfo]);

  if (!userInfo) return null;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- CREATE / UPDATE LOGIC ---
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { ...formData, price: Number(formData.price), countInStock: Number(formData.countInStock) };

      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${editingId}`, payload, config);
        setMessage({ type: "success", text: "PRODUCT UPDATED!" });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, payload, config);
        setMessage({ type: "success", text: "PRODUCT ADDED!" });
      }

      setFormData(emptyForm);
      setEditingId(null);
      fetchProducts(); 
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error saving product" });
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const deleteHandler = async (id) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  // --- EDIT LOGIC ---
  const editHandler = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name, brand: product.brand, category: product.category,
      price: product.price, countInStock: product.countInStock,
      image: product.image, description: product.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  if (!isMounted || !userInfo || userInfo.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* --- TOP: ORDER FULFILLMENT --- */}
        <div className="bg-neo-secondary border-8 border-black p-8 shadow-neo-md rotate-[1deg]">
          <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-4 mb-6 flex items-center gap-4">
            <Package className="h-8 w-8 stroke-[3px]" /> Global Order Fulfillment
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-white border-4 border-black p-6 font-bold uppercase text-center">
              No active manifests found.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border-4 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-neo-sm">
                  <div>
                    <p className="font-black uppercase tracking-tight">ID: {order._id}</p>
                    <p className="font-bold text-sm text-black/70 uppercase">
                      Placed: {new Date(order.createdAt).toLocaleDateString()} | Total: ${order.totalPrice.toFixed(2)} | User: {order.user?.name || 'Guest'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className={`px-3 py-1 font-black uppercase text-sm border-2 border-black ${
                      order.status === 'Delivered' ? 'bg-green-400' : 
                      order.status === 'Shipped' ? 'bg-neo-accent' : 'bg-neo-bg'
                    }`}>
                      {order.status || 'Processing'}
                    </span>
                    <Link href={`/order/${order._id}`} className="bg-black text-white px-6 py-2 font-black uppercase text-sm border-4 border-black hover:bg-white hover:text-black transition-colors text-center flex-grow md:flex-grow-0">
                      View / Update
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* --- MIDDLE: THE PRODUCT FORM --- */}
        <div>
          <div className="inline-block bg-black text-white border-4 border-black px-6 py-2 mb-8 -rotate-1 shadow-neo-sm">
            <h1 className="font-black text-2xl uppercase tracking-widest">Hardware Control Panel</h1>
          </div>

          <Card className="rotate-1">
            <CardHeader className="bg-neo-secondary border-b-4 border-black text-center py-6">
              <CardTitle className="text-3xl sm:text-4xl">
                {editingId ? "UPDATE PRODUCT" : "ADD NEW PRODUCT"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              {message && (
                <div className={`mb-6 p-4 font-black text-lg uppercase text-center border-4 border-black shadow-neo-sm ${message.type === 'success' ? 'bg-green-400' : 'bg-neo-accent text-white'}`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Product Name</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Brand</label><Input name="brand" value={formData.brand} onChange={handleChange} required /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Category</label><Input name="category" value={formData.category} onChange={handleChange} required /></div>
                  <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Price ($)</label><Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required /></div>
                  <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Stock Qty</label><Input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required /></div>
                </div>
                <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Image URL</label><Input name="image" value={formData.image} onChange={handleChange} required /></div>
                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-widest text-sm">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="flex w-full border-4 border-black bg-white px-4 py-2 text-lg font-bold focus-visible:bg-neo-secondary" required />
                </div>
                <div className="flex gap-4 mt-8">
                  <Button type="submit" className="w-full text-xl h-16" disabled={loading}>
                    {loading ? "SAVING..." : editingId ? "UPDATE IN DB" : "LAUNCH PRODUCT"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" className="text-xl h-16 px-8" onClick={() => { setEditingId(null); setFormData(emptyForm); }}>
                      CANCEL
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* --- BOTTOM: THE PRODUCT LIST --- */}
        <div>
          <div className="inline-block bg-black text-white border-4 border-black px-6 py-2 mb-8 -rotate-1 shadow-neo-sm">
            <h1 className="font-black text-2xl uppercase tracking-widest">Database Inventory</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white border-4 border-black flex flex-col shadow-neo-sm">
                <div className="h-48 border-b-4 border-black relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-neo-secondary border-2 border-black px-2 py-1 font-bold text-xs">
                    ${product.price}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-black text-xl uppercase leading-tight mb-1">{product.name}</h3>
                  <p className="text-xs font-bold text-black/60 uppercase">Stock: {product.countInStock}</p>
                </div>
                <div className="flex border-t-4 border-black">
                  <button onClick={() => editHandler(product)} className="flex-1 py-3 font-bold uppercase text-sm hover:bg-neo-secondary transition-colors border-r-4 border-black flex justify-center items-center gap-2">
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => deleteHandler(product._id)} className="flex-1 py-3 font-bold uppercase text-sm hover:bg-neo-accent hover:text-white transition-colors flex justify-center items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}