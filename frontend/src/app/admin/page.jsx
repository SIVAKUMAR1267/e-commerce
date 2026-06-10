"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, PackageSearch, Tag, Search } from "lucide-react";
import Pagination from "@/components/Pagination"; // Re-using your component!

export default function AdminDashboard() {
  const router = useRouter();
  const { userInfo, token } = useAuthStore();
  
  const [isMounted, setIsMounted] = useState(false);
  
  // --- NEW: Pagination & Search State ---
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const emptyForm = { name: "", brand: "", category: "", price: "", countInStock: "", image: "", description: "", isSale: false, salePrice: "" };
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 1. Debounce Search AND Reset Page Number
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 when typing a new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Fetch Logic (Wrapped in useCallback so we can call it anywhere)
  const fetchProducts = useCallback(async () => {
    try {
      const config = userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
      
      // Sending the exact page and keyword to your backend!
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products?pageNumber=${currentPage}&keyword=${debouncedSearch}`, 
        config
      );
      
      const items = data.products ? data.products : data;
      setProducts(Array.isArray(items) ? items : []);
      if (data.pages) setPages(data.pages);

    } catch (error) {
      console.error("Failed to fetch products");
      setProducts([]); 
    }
  }, [currentPage, debouncedSearch, userInfo?.token]);

  // 3. Trigger Fetch on load, page change, or search
  useEffect(() => {
    setIsMounted(true);
    if (userInfo && userInfo.role !== "admin") {
      router.push("/");
    } else if (userInfo) {
      fetchProducts();
    }
  }, [userInfo, router, fetchProducts]);

  if (!userInfo) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // --- CREATE / UPDATE LOGIC ---
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { 
        ...formData, 
        price: Number(formData.price), 
        countInStock: Number(formData.countInStock),
        salePrice: formData.isSale ? Number(formData.salePrice) : 0
      };

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
      image: product.image, description: product.description,
      isSale: product.isSale || false,          
      salePrice: product.salePrice || ""        
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  if (!isMounted || !userInfo || userInfo.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-neo-bg bg-halftone py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* --- TOP: PERSONALIZED ADMIN HEADER --- */}
        <div className="bg-black text-white p-8 border-4 border-black shadow-neo-md rotate-[-1deg] flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest">Admin Control // Sivakumar R.</h1>
            <p className="font-bold uppercase text-neo-accent mt-2">System privileges active.</p>
          </div>
          
          <Link href="/admin/orders" className="group flex items-center gap-4 bg-neo-secondary text-black border-4 border-black px-6 py-4 shadow-neo-sm hover:translate-x-1 hover:-translate-y-1 hover:shadow-neo-md transition-all">
            <PackageSearch className="h-8 w-8 stroke-[3px] group-hover:animate-bounce" />
            <div className="text-left">
              <div className="font-black uppercase text-xl leading-none">Fulfillment</div>
              <div className="font-bold text-xs uppercase tracking-widest text-black/70 mt-1">Manage Orders</div>
            </div>
          </Link>
        </div>
        
        {/* --- MIDDLE: THE PRODUCT FORM --- */}
        <div>
          <div className="inline-block bg-white text-black border-4 border-black px-6 py-2 mb-8 rotate-1 shadow-neo-sm">
            <h2 className="font-black text-2xl uppercase tracking-widest">Hardware Control Panel</h2>
          </div>

          <Card className="-rotate-1 border-4 border-black shadow-neo-md">
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
                  <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Base Price ($)</label><Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required /></div>
                  <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Stock Qty</label><Input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required /></div>
                </div>
                <div className="space-y-2"><label className="font-bold uppercase tracking-widest text-sm">Image URL</label><Input name="image" value={formData.image} onChange={handleChange} required /></div>
                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-widest text-sm">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="flex w-full border-4 border-black bg-white px-4 py-2 text-lg font-bold focus-visible:bg-neo-secondary outline-none" required />
                </div>

                {/* SALE TOGGLE UI */}
                <div className={`p-6 border-4 border-black transition-colors ${formData.isSale ? 'bg-red-500 text-white' : 'bg-neo-muted text-black'}`}>
                  <div className="flex items-center gap-4">
                    <input type="checkbox" name="isSale" id="isSale" checked={formData.isSale} onChange={handleChange} className="w-6 h-6 cursor-pointer accent-black" />
                    <label htmlFor="isSale" className="font-black uppercase text-xl sm:text-2xl cursor-pointer">Trigger Clearance (On Sale)</label>
                  </div>
                  {formData.isSale && (
                    <div className="mt-4 space-y-2 bg-white text-black p-4 border-4 border-black">
                      <label className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <Tag className="h-4 w-4" /> Sale Price Override ($)
                      </label>
                      <Input type="number" step="0.01" name="salePrice" value={formData.salePrice} onChange={handleChange} className="text-xl font-black border-4 border-black text-red-500" required />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button type="submit" className="w-full text-xl h-16 border-4 border-black shadow-neo-sm" disabled={loading}>
                    {loading ? "SAVING..." : editingId ? "UPDATE IN DB" : "LAUNCH PRODUCT"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" className="text-xl h-16 px-8 border-4 border-black" onClick={() => { setEditingId(null); setFormData(emptyForm); }}>
                      CANCEL
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* --- BOTTOM: THE PRODUCT LIST WITH SEARCH & PAGINATION --- */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div className="inline-block bg-white text-black border-4 border-black px-6 py-2 -rotate-1 shadow-neo-sm self-start md:self-auto">
              <h2 className="font-black text-2xl uppercase tracking-widest">Database Inventory</h2>
            </div>
            
            {/* NEW: SEARCH BAR */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black stroke-[3px]" />
              <Input 
                type="text" 
                placeholder="SEARCH INVENTORY..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 py-6 border-4 border-black font-black uppercase shadow-neo-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white border-4 border-black flex flex-col shadow-neo-sm hover:-translate-y-1 transition-transform">
                <div className="h-48 border-b-4 border-black relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-neo-secondary border-2 border-black px-2 py-1 font-bold text-xs uppercase shadow-neo-sm">
                    ${product.price}
                  </div>
                  {product.isSale && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white border-2 border-black px-2 py-1 font-black text-xs uppercase shadow-neo-sm animate-pulse">
                      SALE: ${product.salePrice}
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-black text-xl uppercase leading-tight mb-1 truncate">{product.name}</h3>
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

          {/* NEW: PAGINATION COMPONENT */}
          {pages > 1 && (
            <Pagination 
              pages={pages} 
              page={currentPage} 
              onPageChange={setCurrentPage} 
            />
          )}

          {products.length === 0 && (
            <div className="text-center py-12 bg-white border-4 border-black shadow-neo-sm mt-8">
              <p className="font-black text-xl uppercase">NO ASSETS FOUND IN DATABASE.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}