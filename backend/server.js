import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';

// Configuration Import
import connectDB from './config/db.js';

// Route & Middleware Imports
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Connect to the database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});
app.get('/api/health', (req, res) => {
  res.status(200).send('Server is alive');
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});