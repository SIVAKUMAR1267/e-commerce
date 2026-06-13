"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Terminal, Database, Loader2, ServerCrash } from "lucide-react";

export default function ServerBootLoader({ children }) {
  const [isAwake, setIsAwake] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {
    let checkInterval;
    let timeInterval;

    const wakeUpServer = async () => {
      try {
        // We ping a lightweight, public route to check if the Render server is alive
        // Setting a 5-second timeout so it doesn't hang forever on dead requests
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/trending`, { timeout: 5000 });
        setIsAwake(true);
      } catch (error) {
        console.warn("Server still booting... retrying.");
        // If it takes longer than 60 seconds, something is actually broken
        if (elapsedTime > 60) setErrorStatus(true);
      }
    };

    if (!isAwake) {
      wakeUpServer(); // Fire the first ping immediately

      // Fire subsequent pings every 5 seconds
      checkInterval = setInterval(wakeUpServer, 5000);

      // Simple visual timer so the user knows the app isn't frozen
      timeInterval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(checkInterval);
      clearInterval(timeInterval);
    };
  }, [isAwake, elapsedTime]);

  // Once the server is verified online, render the actual application
  if (isAwake) {
    return <>{children}</>;
  }

  // THE BOOT SCREEN UI
  return (
    <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-6 font-mono selection:bg-neo-accent selection:text-black">
      <div className="w-full max-w-2xl border-4 border-white p-1 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
        
        {/* Terminal Header */}
        <div className="border-b-4 border-white pb-2 mb-6 flex justify-between items-center px-4 pt-2">
          <div className="flex items-center gap-3">
            <Terminal className="h-6 w-6" />
            <span className="font-black tracking-widest uppercase text-sm sm:text-base">SYS_BOOT_SEQUENCE</span>
          </div>
          <div className="text-xs font-bold animate-pulse">V.4.0.1</div>
        </div>

        {/* Terminal Output */}
        <div className="px-4 pb-6 space-y-4 text-sm sm:text-base font-bold">
          
          <p className="text-green-400">&gt; INITIALIZING FRONTEND CLIENT... <span className="text-white">[OK]</span></p>
          <p className="text-green-400">&gt; LOCATING BACKEND MAINFRAME... <span className="text-white">[OK]</span></p>
          
          <div className="flex items-start gap-4 text-yellow-400 border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-400/10">
            <Database className="h-6 w-6 shrink-0 mt-1" />
            <div>
              <p className="font-black uppercase tracking-widest">COLD START DETECTED</p>
              <p className="text-xs uppercase mt-1">
                The global manifest server is currently waking up from standby. This operation typically requires 30-50 seconds to allocate cloud resources.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t-2 border-white/20">
            {errorStatus ? (
              <ServerCrash className="h-6 w-6 text-red-500 animate-bounce" />
            ) : (
              <Loader2 className="h-6 w-6 animate-spin" />
            )}
            <span className="uppercase tracking-widest">
              {errorStatus ? "CRITICAL: SERVER FAILED TO RESPOND" : `PINGING SERVER... ELAPSED TIME: ${elapsedTime}s`}
            </span>
          </div>

          {/* Fake Progress Bar that loops visually to reduce bounce rates */}
          {!errorStatus && (
            <div className="w-full h-4 border-2 border-white mt-4 p-0.5">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-linear"
                style={{ width: `${Math.min((elapsedTime / 40) * 100, 95)}%` }}
              />
            </div>
          )}

          {errorStatus && (
            <div className="mt-6 bg-red-500 text-black p-4 font-black uppercase text-center border-4 border-white">
              FATAL TIMEOUT. PLEASE REFRESH THE TERMINAL OR CONTACT SUPPORT.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}