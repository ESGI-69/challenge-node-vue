import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);
import fs from 'fs';
import path from 'path';

const stripePayment = {
  /**
   * Create a checkout session
   * @param {object} product - product object
   * @returns {object} - checkout session object
   * @see https://stripe.com/docs/api/checkout/sessions/create
   */
  createCheckout: async (product) => {
    // console.log('payments product', product.price);
    const checkout = await stripe.checkout.sessions.create({
      // copy same image in back than in front and get just the name from the front
      // const image = fs.readFileSync('../../frontend')
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.price,
        },
        quantity: product.quantity,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/shop/success/${product.paymentId}`,
      cancel_url: `${process.env.FRONTEND_URL}/shop/cancel/${product.paymentId}`,
    });
    // console.log('payments checkout', checkout);
    // console.log('-----------------------------');
    // console.log('RETRIEVE CHECKOUT', await stripe.checkout.sessions.retrieve(checkout.id));
    return checkout;
  },
};

export default stripePayment;
