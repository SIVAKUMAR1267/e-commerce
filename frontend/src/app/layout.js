import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SHOP CARTEL",
  description: "A loud and unapologetic e-commerce experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <NavbarWrapper />
        <CartDrawer />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}