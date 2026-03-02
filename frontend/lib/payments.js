import Razorpay from "razorpay";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const razorpay = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export async function createRazorpayOrder({ amount, currency = "INR", receipt }) {
  if (!razorpay) {
    return {
      mocked: true,
      id: `mock_rzp_${Date.now()}`,
      amount,
      currency,
      receipt,
    };
  }

  return razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt,
  });
}

export async function createStripeIntent({ amount, currency = "usd", metadata = {} }) {
  if (!stripe) {
    return {
      mocked: true,
      id: `mock_pi_${Date.now()}`,
      client_secret: `mock_secret_${Date.now()}`,
      amount,
      currency,
    };
  }

  return stripe.paymentIntents.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}
