"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      // Hitting our custom Express backend
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        { email, password },
        config
      );

      // Save to Zustand (which saves to localStorage)
      login(data);
      router.push("/"); // Redirect to home on success
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-neo-bg bg-grid-pattern p-6">
      <div className="w-full max-w-md relative">
        {/* Decorative Badge */}
        <div className="absolute -top-4 -right-4 bg-neo-secondary border-4 border-black px-4 py-1 rotate-6 z-10 shadow-neo-sm">
          <span className="font-black uppercase tracking-widest text-sm">Authorized Only</span>
        </div>

        <Card className="rotate-[-1deg]">
          <CardHeader className="bg-neo-muted/30 border-b-4 border-black text-center py-8">
            <CardTitle className="text-4xl sm:text-5xl">LOG IN</CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 bg-black text-white p-3 font-bold text-sm uppercase text-center border-4 border-neo-accent">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-sm">Email Address</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="USER@CARTEL.COM" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-sm">Password</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
              </div>

              <Button type="submit" className="w-full text-lg h-14 mt-4" disabled={loading}>
                {loading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t-4 border-black text-center">
              <p className="font-bold text-sm uppercase">
                New to the Cartel?{" "}
                <Link href="/register" className="text-neo-accent underline hover:bg-black hover:text-white px-1 transition-colors">
                  Create an Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}