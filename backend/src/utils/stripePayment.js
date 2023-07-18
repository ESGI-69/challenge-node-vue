import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

const stripePayment = {
  /**
   * Create a checkout session
   * @param {object} product - product object
   * @returns {object} - checkout session object
   * @see https://stripe.com/docs/api/checkout/sessions/create
   */
  createCheckout: async (product) => {
    const imageLink = process.env.FRONTEND_URL + product.image;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: [imageLink],
          },
          unit_amount: product.price,
        },
        quantity: product.quantity,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/shop/checkout?id=${product.paymentId}&isSuccess=true`,
      cancel_url: `${process.env.FRONTEND_URL}/shop/checkout?id=${product.paymentId}&isSuccess=false`,
    });
    return session;
  },

  /**
   *
   * @param {string} sessionId - checkout session id
   * @returns
   */

  retrieveCheckout: async (sessionId) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  },

  closeCheckout: async (sessionId) => {
    await stripe.checkout.sessions.expire(sessionId);
  },
};

export default stripePayment;
