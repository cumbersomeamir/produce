import Razorpay from "razorpay";
import Stripe from "stripe";

const razorpay = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function createPaymentOrder({ amount, currency = "INR", receipt }) {
  if (!razorpay) {
    return { id: `mock_rzp_${Date.now()}`, amount, currency, receipt, mocked: true };
  }

  return razorpay.orders.create({ amount: Math.round(Number(amount) * 100), currency, receipt });
}

export async function createInternationalIntent({ amount, currency = "usd", metadata = {} }) {
  if (!stripe) {
    return { id: `mock_pi_${Date.now()}`, amount, currency, metadata, mocked: true };
  }

  return stripe.paymentIntents.create({ amount: Math.round(Number(amount) * 100), currency, metadata });
}
