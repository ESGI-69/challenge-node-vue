import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

const payment = {
  /**
   * Create a checkout session
   * @param {object} product - product object
   * @returns {object} - checkout session object
   * @see https://stripe.com/docs/api/checkout/sessions/create
   */
  createCheckout: async (product) => {
    const checkout = await stripe.checkout.sessions.create({
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
      success_url: `${process.env.FRONTEND_URL}/shop/success`,
      cancel_url: `${process.env.FRONTEND_URL}/shop/cancel`,
    });
    console.log(res.json({ id: checkout.id }));
    return checkout;
  },
  //   app.post("/payment", async (req, res) => {
  //     const { product } = req.body;
  //     const session = await stripe.checkout.sessions.create({
  //         payment_method_types: ["card"],
  //         line_items: [
  //             {
  //                 price_data: {
  //                     currency: "inr",
  //                     product_data: {
  //                         name: product.name,
  //                         images: [product.image],
  //                     },
  //                     unit_amount: product.amount * 100,
  //                 },
  //                 quantity: product.quantity,
  //             },
  //         ],
  //         mode: "payment",
  //         success_url: `${YOUR_DOMAIN}/success.html`,
  //         cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  //     });

//     res.json({ id: session.id });
// });
};

export default payment;
