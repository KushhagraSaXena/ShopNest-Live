// controllers/paymentController.js
// import Stripe from 'stripe';
// import dotenv from 'dotenv';
// dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { cartItems } = req.body;
//     // console.log('Received cartItems:', cartItems);

//     if (!Array.isArray(cartItems) || cartItems.length === 0) {
//       return res.status(400).json({ error: '🛒 Cart is empty or invalid.' });
//     }

//     const createLineItems = (cartItems) => {
//       return cartItems.map((item) => {
//         const imageUrl = item.image?.startsWith("http")
//           ? item.image
//           : `http://localhost:5000${item.image?.replace(/\\/g, "/") || ""}`;

//         return {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: item.name,
//               images: imageUrl ? [imageUrl] : [],
//             },
//             unit_amount: Math.round(item.price * 100),
//           },
//           quantity: item.quantity || item.qty || 1,
//         };
//       });
//     };

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: createLineItems(cartItems),
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/success?orderId=${order._id}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error('Stripe Error:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// };


// controllers/paymentController.js
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js'; // make sure this path is correct
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ 1. Create Stripe Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const { orderId, cartItems } = req.body;

    if (!orderId || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Missing orderId or empty cart.' });
    }

    const line_items = cartItems.map((item) => {
      const imageUrl = item.image?.startsWith("http")
        ? item.image
        : `${process.env.SERVER_URL || "http://localhost:5000"}${item.image?.replace(/\\/g, "/")}`;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || item.qty || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    // res.status(200).json({ id: session.id }); // <-- send session ID to frontend
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error.message);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};

// ✅ 2. Stripe Webhook for Payment Confirmation
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const orderId = new URL(session.success_url).searchParams.get('orderId');

      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: session.payment_intent,
          status: session.payment_status,
          email_address: session.customer_email,
        };

        await order.save();
        console.log(`✅ Order ${orderId} marked as paid via Stripe`);
      } else {
        console.warn(`❌ Order not found for ID: ${orderId}`);
      }
    } catch (err) {
      console.error('Order update error:', err.message);
    }
  }

  res.status(200).json({ received: true });
};

export { createCheckoutSession, stripeWebhook };
