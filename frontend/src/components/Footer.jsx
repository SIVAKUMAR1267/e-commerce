"use client";
import Link from "next/link";
import { ShieldCheck, Cpu, Terminal, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t-8 border-black mt-24">
      
      {/* 1. NEWSLETTER TERMINAL */}
      <div className="border-b-8 border-black bg-neo-accent py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
          <div className="max-w-xl space-y-2">
            <h3 className="text-4xl font-black uppercase tracking-tighter">JOIN THE MANIFEST NETWORK</h3>
            <p className="font-bold text-black/80 uppercase text-sm">
              No filler updates. Just operational patch details and clearance drop coordinates routed directly to your terminal.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="w-full lg:max-w-lg flex items-stretch border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white rotate-1 focus-within:rotate-0 transition-transform">
            <input 
              type="email" 
              placeholder="ENTER TERMINAL EMAIL..." 
              className="flex-grow bg-transparent font-bold uppercase px-6 outline-none h-16 text-black placeholder:text-black/50" 
              required
            />
            <button type="submit" className="h-16 w-16 bg-black text-white flex items-center justify-center shrink-0 border-l-4 border-black hover:bg-neo-secondary hover:text-black transition-colors">
              <ArrowRight className="h-8 w-8 stroke-[3px]" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAINFRAME DIRECTORY LINKS */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* BRAND IDENTITY NODE */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-black text-white px-4 py-2 font-black text-3xl uppercase tracking-tighter inline-block -rotate-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            SHOP CARTEL
          </div>
          <p className="font-bold text-sm uppercase leading-tight text-black/80 max-w-xs border-l-4 border-neo-accent pl-4">
            Structural integrity and high-saturation energy components. Built to override generic marketplace configurations.
          </p>
        </div>

        {/* NAVIGATION LINKS CONTAINER */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-sm text-black border-b-4 border-black pb-2 flex items-center gap-2">
              <Terminal className="h-4 w-4 stroke-[3px]" /> CATALOG
            </h4>
            <ul className="space-y-3 font-bold uppercase text-sm">
              <li><Link href="/" className="hover:bg-neo-accent hover:pl-2 transition-all">All Inventory</Link></li>
              <li><Link href="/trending" className="hover:bg-neo-accent hover:pl-2 transition-all">Trending Nodes</Link></li>
              <li><Link href="/onsale" className="hover:bg-neo-accent hover:pl-2 transition-all">Clearance Grid</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-sm text-black border-b-4 border-black pb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 stroke-[3px]" /> NETWORK
            </h4>
            <ul className="space-y-3 font-bold uppercase text-sm">
              <li><Link href="/profile" className="hover:bg-neo-accent hover:pl-2 transition-all">User Uplink</Link></li>
              <li><a href="#" className="hover:bg-neo-accent hover:pl-2 transition-all">Stripe Verification</a></li>
              <li><a href="#" className="hover:bg-neo-accent hover:pl-2 transition-all">Support Terminal</a></li>
            </ul>
          </div>

          <div className="space-y-6 col-span-2 sm:col-span-1">
            <h4 className="font-black uppercase tracking-widest text-sm text-black border-b-4 border-black pb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 stroke-[3px]" /> SECURE
            </h4>
            <p className="text-xs font-bold uppercase leading-relaxed text-black/70">
              Transactions processed using automated Stripe tunnels. Manifest architecture built on Next.js Framework routing. All data fully encrypted.
            </p>
          </div>
        </div>

      </div>

      {/* 3. LEGAL METADATA */}
      <div className="border-t-8 border-black bg-black text-white py-6 px-6 sm:px-12 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-black uppercase tracking-widest text-xs">
          <div>
            © {new Date().getFullYear()} SHOP CARTEL INC. // V4.0
          </div>
          <div className="flex gap-8 text-white/50">
            <a href="#" className="hover:text-neo-accent transition-colors">PRIVACY_PROTOCOL</a>
            <a href="#" className="hover:text-neo-accent transition-colors">TERMS_OF_ENGAGEMENT</a>
          </div>
        </div>
      </div>
    </footer>
  );
}