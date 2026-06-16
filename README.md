Unfiltered Streetwear // E-Commerce Platform

A high-performance, full-stack e-commerce application designed with a Neo-Brutalist aesthetic. Built for speed, security, and scalability, featuring a dynamic inventory system and real-time administrative controls.
🚀 Live Demo

Access the Deployment
🛠 Tech Stack

    Frontend: React, Next.js (Turbopack), Tailwind CSS, Lucide-React

    Backend: Node.js, Express.js

    Database: MongoDB (Mongoose ODM)

    Authentication: JSON Web Tokens (JWT) & Role-Based Access Control (RBAC)

    Deployment: Vercel (Frontend), Render (Backend)

⚡ Key Features

    Server-Side Caching: Integrated node-cache to minimize database hits and reduce API latency for the product catalog by ~40%.

    Dynamic Pricing Engine: Built a flexible sale system enabling admins to trigger global promotions, with automated front-end price calculation and conditional logic.

    Admin Control Panel: A dedicated interface for managing inventory, stock levels, and clearance protocols with real-time UI updates.

    Optimized UX: Implemented debounced server-side search and custom pagination, ensuring smooth navigation through large product datasets without page reloads.

    Robust Security: Implemented JWT-based authentication with middleware to ensure administrative routes are protected.

📂 Project Structure
Plaintext

/src
  /app           # Next.js App Router (Pages & Layouts)
  /components    # Reusable UI components (Brutalist style)
  /store         # Global state management (Zustand)
/backend
  /controllers   # Business logic (Caching, Pricing, Inventory)
  /models        # Mongoose Schemas (Product, User, Order)
  /routes        # REST API endpoints
  /middleware    # Auth & Admin security guards

🏗 Setup Instructions

    Clone the repository:

git clone https://github.com/SIVAKUMAR1267/e-commerce.git

2. **Configure Environment Variables:**
   Create a `.env` file in both `frontend` and `backend` directories with the following:
   * `MONGO_URI`
   * `JWT_SECRET`
   * `NEXT_PUBLIC_API_URL`
3. **Run the Backend:**
   ```bash
cd backend
npm install
npm run dev

    Run the Frontend:

cd frontend
npm install
npm run dev


---

## 👨‍💻 Developed by
**Sivakumar R.**
*   [My Protfolio](https://myportfolio-lt5n.onrender.com/)
*   [GitHub Profile](https://github.com/SIVAKUMAR1267)