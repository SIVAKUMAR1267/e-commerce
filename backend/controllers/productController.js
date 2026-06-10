import Product from '../models/Product.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12; 
    const page = Number(req.query.pageNumber) || 1;
    
    // 1. DYNAMIC SEARCH QUERY
    // Looks for the keyword in either the name OR the brand, ignoring case ($options: 'i')
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    // 2. DYNAMIC CATEGORY QUERY
    const category = req.query.category && req.query.category !== 'ALL'
      ? { category: req.query.category }
      : {};

    // Combine both filters
    const query = { ...keyword, ...category };

    // Create a unique cache key based on their exact search
    const cacheKey = `products_page_${page}_${req.query.keyword || 'none'}_${req.query.category || 'ALL'}`;

    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    // Pass the combined query to MongoDB
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1)); 

    const responseData = { 
      products, 
      page, 
      pages: Math.ceil(count / pageSize) 
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Create a product
// @route   POST /api/products (Admin Only)
export const createProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = new Product({
    user: req.user._id, // The admin who created it
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
};
// @desc    Fetch single product
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Invalid product ID' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { 
      name, price, description, image, brand, category, countInStock, 
      isSale, salePrice 
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      
      // Save the new fields (This works on old products too!)
      product.isSale = isSale !== undefined ? isSale : product.isSale;
      product.salePrice = salePrice !== undefined ? salePrice : product.salePrice;

      const updatedProduct = await product.save();

      // --- CRITICAL FIX: WIPE THE RAM CACHE ---
      // This forces the homepage to instantly fetch the new sale data!
      if (typeof cache !== 'undefined') {
        cache.flushAll(); 
      }

      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Delete a product
// @route   DELETE /api/products/:id (Admin Only)
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
// @route   GET /api/products/trending
// @desc    Get Trending Products
// @route   GET /api/products/trending
export const getTrendingProducts = async (req, res) => {
  try {
    if (req.query.pageNumber) {
      const pageSize = 12;
      const page = Number(req.query.pageNumber) || 1;
      
      let count = await Product.countDocuments({ soldCount: { $gt: 0 } }); 
      let products = await Product.find({ soldCount: { $gt: 0 } })
        .sort({ soldCount: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      // FALLBACK FOR DEDICATED PAGE: If no sales exist, show newest items
      if (products.length === 0) {
         count = await Product.countDocuments({});
         products = await Product.find({})
           .sort({ createdAt: -1 }) // Sort by newest
           .limit(pageSize)
           .skip(pageSize * (page - 1));
      }
      
      return res.json({ products, page, pages: Math.ceil(count / pageSize) });
    }

    // MAIN QUERY FOR HOMEPAGE WIDGET
    let products = await Product.find({ soldCount: { $gt: 0 } })
      .sort({ soldCount: -1 })
      .limit(4);

    // FALLBACK FOR HOMEPAGE: If no items have ever been sold, show the 4 newest items!
    if (products.length === 0) {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
    }
      
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get Products currently on Sale
// @route   GET /api/products/sale
export const getSaleProducts = async (req, res) => {
  try {
    if (req.query.pageNumber) {
      const pageSize = 12;
      const page = Number(req.query.pageNumber) || 1;
      const count = await Product.countDocuments({ isSale: true });
      const products = await Product.find({ isSale: true })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
      
      return res.json({ products, page, pages: Math.ceil(count / pageSize) });
    }

    const products = await Product.find({ isSale: true }).limit(4);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Related Products by Category
// @route   GET /api/products/related/:id
export const getRelatedProducts = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (currentProduct) {
      // Find 4 items in the same category, excluding the current one
      const related = await Product.find({
        _id: { $ne: currentProduct._id },
        category: currentProduct.category,
      }).limit(4);
      res.json(related);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
