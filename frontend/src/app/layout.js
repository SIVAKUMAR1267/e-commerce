import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import NavbarWrapper from "@/components/NavbarWrapper";

export const metadata = {
  title: "Neo-Brutalist Store",
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
      </body>
    </html>
  );
}