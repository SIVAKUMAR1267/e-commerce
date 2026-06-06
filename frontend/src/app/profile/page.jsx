"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { userInfo } = useAuthStore();
  const { shippingAddress, saveShippingAddress } = useCartStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState(null);

  // Local state for the address form, pre-filled with existing data
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // Save the updated address to our global Zustand store
    saveShippingAddress(formData);
    setMessage({ type: "success", text: "ADDRESS PROTOCOL UPDATED!" });
    
    // Clear the success message after 3 seconds
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT: STATIC IDENTITY CARD */}
          <div className="md:col-span-1">
            <Card className="rotate-1 shadow-neo-sm bg-neo-secondary border-4 border-black">
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
      </div>
    </div>
  );
}