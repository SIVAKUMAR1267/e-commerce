"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Edit, Trash2, Plus, Tag, X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminProductsPage() {
  const router = useRouter();
  const { userInfo, token } = useAuthStore();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 1. Security Check & Fetch Data
  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      router.push("/login");
      return;
    }

    fetchProducts();
  }, [userInfo, router]);

  const fetchProducts = async () => {
    try {
      // Add the config to send your admin token just in case your route is protected!
      const config = userInfo?.token ? {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      } : {};

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, config);
      
      // Determine exactly where the array is
      const items = data.products ? data.products : data;

      // DEFENSIVE CHECK: Is it actually an array?
      if (Array.isArray(items)) {
        setProducts(items);
      } else {
        console.error("Backend returned an unexpected format:", data);
        setProducts([]); // Fallback to an empty array so .map() doesn't crash!
      }

    } catch (error) {
      console.error("Failed to fetch inventory for admin", error);
      setProducts([]); // Fallback to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // 2. Open Edit Modal & Populate Data
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      isSale: product.isSale || false,
      salePrice: product.salePrice || 0,
      countInStock: product.countInStock || 0,
    });
  };

  // 3. Submit Update to Backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${editingProduct._id}`,
        editForm,
        config
      );
      
      // Refresh list and close modal
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Update failed. Check console.");
    }
  };

  // 4. Input Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center">
      <h1 className="text-4xl font-black uppercase animate-pulse border-4 border-black bg-white p-8 shadow-neo-md">ACCESSING MAINFRAME...</h1>
    </div>
  );

  return (
    <main className="min-h-screen bg-neo-bg bg-halftone py-12 px-4 sm:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white border-4 border-black p-8 shadow-neo-xl rotate-1">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">Inventory Control</h1>
            <p className="font-bold text-black/60 uppercase tracking-widest mt-2">Master Database Override</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center gap-2 bg-neo-accent text-white px-6 py-4 font-black uppercase border-4 border-black shadow-neo-sm hover:-translate-y-1 transition-all">
            <Plus className="h-6 w-6 stroke-[3px]" /> Deploy New Asset
          </button>
        </div>

        {/* Brutalist Data Table */}
        <div className="bg-white border-4 border-black shadow-neo-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white font-black uppercase text-xl">
                <th className="p-4 border-b-4 border-black">ID</th>
                <th className="p-4 border-b-4 border-black">Product Name</th>
                <th className="p-4 border-b-4 border-black">Base Price</th>
                <th className="p-4 border-b-4 border-black">Status</th>
                <th className="p-4 border-b-4 border-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="font-bold uppercase">
              {products.map((product) => (
                <tr key={product._id} className="border-b-4 border-black hover:bg-neo-secondary transition-colors">
                  <td className="p-4 text-sm">{product._id.substring(0, 8)}...</td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    {product.isSale ? (
                      <span className="bg-red-500 text-white px-3 py-1 border-2 border-black animate-pulse flex items-center w-max gap-1">
                        <Tag className="h-4 w-4" /> ON SALE (${product.salePrice})
                      </span>
                    ) : (
                      <span className="bg-white px-3 py-1 border-2 border-black text-black/60">STANDARD</span>
                    )}
                  </td>
                  <td className="p-4 flex justify-center gap-4">
                    <button onClick={() => openEditModal(product)} className="bg-white border-4 border-black p-2 shadow-neo-sm hover:-translate-y-1 hover:bg-neo-accent hover:text-white transition-all">
                      <Edit className="h-5 w-5 stroke-[3px]" />
                    </button>
                    <button className="bg-white border-4 border-black p-2 shadow-neo-sm hover:-translate-y-1 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="h-5 w-5 stroke-[3px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* --- OVERRIDE MODAL --- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border-8 border-black p-8 w-full max-w-2xl shadow-[16px_16px_0px_0px_#000] rotate-[-1deg] animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Modify Asset</h2>
              <button onClick={() => setEditingProduct(null)} className="hover:bg-red-500 hover:text-white border-4 border-transparent hover:border-black p-1 transition-all">
                <X className="h-8 w-8 stroke-[3px]" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              
              {/* Product Name */}
              <div>
                <label className="block font-black uppercase text-xl mb-2">Asset Name</label>
                <Input 
                  name="name" 
                  value={editForm.name} 
                  onChange={handleChange} 
                  className="w-full text-lg font-bold p-6 border-4 border-black" 
                />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-black uppercase text-xl mb-2">Base Price ($)</label>
                  <Input 
                    type="number" 
                    name="price" 
                    value={editForm.price} 
                    onChange={handleChange} 
                    className="w-full text-lg font-bold p-6 border-4 border-black" 
                  />
                </div>
                <div>
                  <label className="block font-black uppercase text-xl mb-2">Stock Level</label>
                  <Input 
                    type="number" 
                    name="countInStock" 
                    value={editForm.countInStock} 
                    onChange={handleChange} 
                    className="w-full text-lg font-bold p-6 border-4 border-black" 
                  />
                </div>
              </div>

              {/* HARSH SALE TOGGLE ZONE */}
              <div className={`border-4 border-black p-6 transition-colors ${editForm.isSale ? 'bg-red-500 text-white' : 'bg-neo-muted text-black'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <input 
                    type="checkbox" 
                    name="isSale" 
                    id="isSale"
                    checked={editForm.isSale}
                    onChange={handleChange}
                    className="w-8 h-8 cursor-pointer accent-black"
                  />
                  <label htmlFor="isSale" className="font-black uppercase text-3xl cursor-pointer tracking-tighter">
                    Trigger Clearance Protocol
                  </label>
                </div>

                {editForm.isSale && (
                  <div className="bg-white text-black p-4 border-4 border-black mt-4 animate-in slide-in-from-top-4">
                    <label className="block font-black uppercase text-xl mb-2 flex items-center gap-2">
                      <Tag className="h-5 w-5" /> Sale Price Override ($)
                    </label>
                    <Input 
                      type="number" 
                      name="salePrice" 
                      value={editForm.salePrice} 
                      onChange={handleChange} 
                      className="w-full text-2xl font-black p-6 border-4 border-black text-red-500" 
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-black text-white py-6 font-black uppercase text-2xl border-4 border-black hover:bg-neo-accent hover:text-black transition-all flex justify-center items-center gap-3">
                <Save className="h-8 w-8 stroke-[3px]" /> Save Overrides
              </button>
            </form>

          </div>
        </div>
      )}

    </main>
  );
}