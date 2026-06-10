import express from 'express';
const router = express.Router();

// Import all your controllers
import { 
  getProducts, 
  getProductById, 
  createProduct,      // <-- Restored
  updateProduct,      // <-- Restored
  deleteProduct,      // <-- Restored
  getTrendingProducts, 
  getSaleProducts, 
  getRelatedProducts 
} from '../controllers/productController.js';

// Import your auth middleware (Make sure this path matches your actual middleware file!)
import { protect, admin } from '../middleware/authMiddleware.js'; 

// 1. STATIC ROUTES (Must go first!)
router.route('/trending').get(getTrendingProducts);
router.route('/sale').get(getSaleProducts);

// 2. MAIN ROUTE
// GET fetches all products, POST creates a new one (Admin only)
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// 3. RELATED ITEMS
router.route('/related/:id').get(getRelatedProducts);

// 4. DYNAMIC ID ROUTES (Must go last!)
// GET fetches one, PUT updates one, DELETE removes one
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;