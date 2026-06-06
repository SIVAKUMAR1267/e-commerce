"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Adjust this path if your Navbar is elsewhere

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide the navbar if the user is on the /booting page
  if (pathname === "/booting") {
    return null;
  }

  return <Navbar />;
}