import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

const payment = {
  /**
   * Create a payment intent
   * @param {number} amount - amount of the payment
   * @param {string} currency - currency of the payment
   * @param {object} paymentMethod - payment method object
   * @param {object} billingDetails - billing details object
   * @returns {object} - payment intent object
   */
  createPaymentIntent: async (amount, currency, paymentMethod, billingDetails) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    const paymentDetails = {
      payment_method: paymentMethod,
      billing_details: billingDetails,
    };

    try {
      const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        paymentDetails,
      );
      if (confirmedPaymentIntent.status === 'succeeded') {
        // eslint-disable-next-line no-console
        console.log('Payment succeeded!');
        console.log('confirmedPaymentIntent : ', confirmedPaymentIntent);
        return confirmedPaymentIntent;
      }
    } catch (error) {
      console.error('Payment failed : ', error);
      throw new Error('Payment failed.');
    }
  },
};

export default payment;

// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 1000,
//   currency: 'usd',
// });

// // Collect payment details from the user
// const paymentDetails = {
//   payment_method: {
//     card: {
//       number: '4242424242424242',
//       exp_month: 12,
//       exp_year: 2022,
//       cvc: '123',
//     },
//     billing_details: {
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//     },
//   },
// };

// // Confirm the payment intent
// const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
//   paymentIntent.id,
//   paymentDetails,
// );

// // Handle the response
// if (confirmedPaymentIntent.status === 'succeeded') {
//   console.log('Payment succeeded!');
// } else {
//   console.log('Payment failed.');
// }
