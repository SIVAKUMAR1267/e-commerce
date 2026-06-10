import Link from "next/link";
import { AlertOctagon, RefreshCcw, ShoppingCart, Home } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-neo-bg bg-halftone flex items-center justify-center p-4">
      <div className="bg-white border-8 border-black p-8 md:p-12 max-w-2xl w-full shadow-[16px_16px_0px_0px_#000] rotate-1">
        
        {/* Error Header */}
        <div className="bg-red-500 border-4 border-black p-4 mb-8 flex items-center gap-4 -rotate-2">
          <AlertOctagon className="h-12 w-12 text-white stroke-[3px]" />
          <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter">
            Transaction Failed
          </h1>
        </div>

        {/* Status Message */}
        <div className="space-y-6 mb-10">
          <p className="text-xl md:text-2xl font-black uppercase">
            Protocol Interrupted. The payment gateway rejected the connection or the process was manually aborted.
          </p>
          <div className="bg-neo-accent border-4 border-black p-4 inline-block">
            <p className="font-bold uppercase tracking-widest flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Don't panic: Your cart items have been saved.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/cart" 
            className="flex-1 bg-black text-white px-6 py-4 font-black text-xl md:text-2xl uppercase border-4 border-black shadow-neo-sm hover:bg-white hover:text-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <RefreshCcw className="h-6 w-6 stroke-[3px]" />
            Retry Cart
          </Link>
          
          <Link 
            href="/" 
            className="flex-1 bg-neo-secondary text-black px-6 py-4 font-black text-xl md:text-2xl uppercase border-4 border-black shadow-neo-sm hover:bg-neo-bg hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <Home className="h-6 w-6 stroke-[3px]" />
            Abort
          </Link>
        </div>

      </div>
    </div>
  );
}