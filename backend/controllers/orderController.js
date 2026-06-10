import Stripe from 'stripe';
import Order from '../models/Order.js'; 
import Product from '../models/Product.js';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// @desc    Create new order in the database
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, stripeSessionId } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const itemsFromDB = await Promise.all(
        orderItems.map(async (item) => {
          const dbProduct = await Product.findById(item._id);
          const soldPrice = dbProduct.isSale ? dbProduct.salePrice : dbProduct.price;
          
          return {
            name: dbProduct.name,
            qty: item.qty,
            image: dbProduct.image,
            price: soldPrice, 
            product: dbProduct._id,
          };
        })
      );

      let itemsPrice = itemsFromDB.reduce((acc, item) => acc + item.price * item.qty, 0);
      let totalPrice = itemsPrice + Number(taxPrice || 0) + Number(shippingPrice || 0);

      // --- 1. STRIPE COUPON SECURTIY FIX ---
      // If a stripe checkout session exists, pull the absolute financial truth from Stripe!
      if (stripeSessionId) {
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        totalPrice = session.amount_total / 100;    // Absolute total paid after coupon discounts (Stripe uses cents)
        itemsPrice = session.amount_subtotal / 100; // Subtotal before coupons
      }

      const order = new Order({
        orderItems: itemsFromDB,
        user: req.user._id,
        shippingAddress,
        paymentMethod: paymentMethod || 'Stripe',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Update product stock inventory counters
      for (const item of itemsFromDB) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.qty, soldCount: item.qty } 
        });
      }

      // --- 2. AUTOMATIC DB CART WIPE FIX ---
      // Clear the user's database cart right here on the server to completely eliminate frontend race conditions!
      await User.findByIdAndUpdate(req.user._id, { $set: { cartItems: [] } });

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/orders/create-checkout-session
// @access  Private
// @desc    Create Stripe Checkout Session
// @route   POST /api/orders/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { orderItems } = req.body;

    const lineItems = await Promise.all(
      orderItems.map(async (item) => {
        const dbProduct = await Product.findById(item._id);
        const activePrice = dbProduct.isSale ? dbProduct.salePrice : dbProduct.price;

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: dbProduct.name,
              images: [dbProduct.image],
            },
            unit_amount: Math.round(activePrice * 100),
          },
          quantity: item.qty,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      
      // --- THE MAGIC COUPON LINE ---
      allow_promotion_codes: true, 

      // Notice we are passing the checkout session id into the URL string so the success page can find it later
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// @desc    Update order status and location
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    order.currentLocation = req.body.currentLocation || order.currentLocation;
    
    // Automatically flag as delivered if status matches
    if (order.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};
// @desc    Verify Stripe Session and return true totals after coupons
// @route   GET /api/orders/checkout-session/:id
// @access  Private
export const getCheckoutSessionDetails = async (req, res) => {
  try {
    // Retrieve the session direct from Stripe using the ID passed from the frontend
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    
    res.json({
      totalPrice: session.amount_total / 100,        // Final amount paid (Stripe returns cents)
      subtotal: session.amount_subtotal / 100,      // Before coupons
      discount: session.total_details.amount_discount / 100, // Total saved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};