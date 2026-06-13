"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login); // We log them in immediately after registering

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        { name, email, password },
        config
      );

      login(data); // Save credentials to Zustand
      router.push("/"); // Redirect home
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-neo-bg bg-halftone p-6">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-4 -left-4 bg-neo-accent text-white border-4 border-black px-4 py-1 -rotate-6 z-10 shadow-neo-sm">
          <span className="font-black uppercase tracking-widest text-sm">Join Now</span>
        </div>

        <Card className="rotate-[1deg]">
          <CardHeader className="bg-neo-secondary border-b-4 border-black text-center py-8">
            <CardTitle className="text-4xl sm:text-5xl">REGISTER</CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 bg-black text-white p-3 font-bold text-sm uppercase text-center border-4 border-neo-accent">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-sm">Full Name</label>
                <Input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="JOHN DOE" 
                  required
                />
              </div>

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

              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-sm">Confirm Password</label>
                <Input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
              </div>
              {/* PRIVACY CONSENT CHECKBOX */}
          <div className="flex items-start gap-4 border-4 border-black p-4 bg-neo-muted my-6">
            <div className="relative flex items-center justify-center mt-1">
              <input 
                type="checkbox" 
                id="privacy" 
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="peer appearance-none w-6 h-6 border-4 border-black bg-white checked:bg-black transition-colors cursor-pointer shrink-0" 
                required 
              />
              {/* Custom Checkmark for Brutalist Style */}
              <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <label htmlFor="privacy" className="font-bold text-sm sm:text-base uppercase leading-tight cursor-pointer">
              I ACKNOWLEDGE AND AGREE TO THE <Link href="/privacy" className="text-neo-accent underline hover:text-black">PRIVACY PROTOCOL</Link> AND DATA HANDLING PARAMETERS.
            </label>
          </div>

              <Button 
            type="submit" 
            className="w-full text-xl h-16 shadow-neo-sm" 
            disabled={loading || !agreedToPrivacy} // <--- Add !agreedToPrivacy here
          >
            {loading ? "INITIALIZING..." : "REGISTER TERMINAL"}
          </Button>
            </form>

            <div className="mt-8 pt-6 border-t-4 border-black text-center">
              <p className="font-bold text-sm uppercase">
                Already have an account?{" "}
                <Link href="/login" className="text-neo-accent underline hover:bg-black hover:text-white px-1 transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}