import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import ServerBootLoader from "@/components/ServerBootLoader"; // <-- 1. Import the Loader

export const metadata = {
  title: "SHOP CARTEL",
  description: "A loud and unapologetic e-commerce experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        
        {/* 2. Wrap EVERYTHING inside the Boot Loader */}
        <ServerBootLoader>
          <NavbarWrapper />
          <CartDrawer />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ServerBootLoader>

      </body>
    </html>
  );
}