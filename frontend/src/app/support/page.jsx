"use client";
import Link from "next/link";
import { ArrowLeft, MailWarning, TerminalSquare, Wrench } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-neo-bg bg-halftone py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:-translate-y-1 transition-transform border-4 border-black bg-white px-4 py-2 shadow-neo-sm">
          <ArrowLeft className="w-5 h-5 stroke-[3px]" /> Back to Main
        </Link>

        {/* Header Badge */}
        <div className="flex items-center gap-4 mb-12 bg-white border-4 border-black p-6 shadow-neo-md -rotate-1 inline-flex">
          <Wrench className="h-12 w-12 text-black" />
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">
            Support <span className="text-neo-accent">Terminal</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT COL: Direct Contact Block */}
          <div className="md:col-span-7 space-y-8">
            <div className="bg-white border-8 border-black p-8 shadow-neo-xl">
              <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6 flex items-center gap-3">
                <MailWarning className="h-8 w-8 stroke-[3px] text-red-500" />
                Direct Uplink
              </h2>
              
              <p className="font-bold text-lg uppercase leading-relaxed text-black/80 mb-8">
                Experiencing a system malfunction? Need to track a missing manifest or override an order? Transmit your query directly to our operations team.
              </p>

              <div className="bg-neo-muted border-4 border-black p-6 rotate-1 mb-8">
                <p className="font-black text-xs tracking-widest uppercase text-black/50 mb-2">Primary Comms Channel</p>
                <p className="text-xl sm:text-2xl font-black truncate">shopcartel91@gmail.com</p>
              </div>

              {/* Mailto link instantly opens their email app */}
              <a 
                href="mailto:shopcartel91@gmail.com?subject=Support%20Request:%20Retro%20Street"
                className="w-full flex items-center justify-center gap-3 bg-black text-white px-8 py-6 font-black text-xl uppercase border-4 border-black hover:bg-neo-secondary hover:text-black hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all"
              >
                INITIATE TRANSMISSION
              </a>
            </div>
          </div>

          {/* RIGHT COL: Quick FAQ / System Status */}
          <div className="md:col-span-5 space-y-8">
            <div className="bg-neo-secondary border-4 border-black p-6 shadow-neo-sm -rotate-1">
              <h3 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-4 flex items-center gap-2">
                <TerminalSquare className="h-5 w-5 stroke-[3px]" /> 
                Response Time
              </h3>
              <p className="font-bold text-sm uppercase text-black/80">
                Support nodes are actively monitored. Expect a response transmission within <span className="font-black text-black">24-48 operational hours</span>.
              </p>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-neo-sm rotate-1">
              <h3 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-2 mb-4">
                What to Include
              </h3>
              <ul className="space-y-3 font-bold text-sm uppercase text-black/80">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-black">X</span>
                  Your Order ID (Found in your profile)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-black">X</span>
                  The email address used at checkout
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-black">X</span>
                  A detailed breakdown of the error
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}