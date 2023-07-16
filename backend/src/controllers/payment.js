// import paymentService from '../services/payment';
import stripePayment from '../utils/stripePayment.js';
import paymentService from '../services/payment.js';
import productService from '../services/product.js';

export default {
  /**
   * Express.js controller POST /payment
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async post(req, res, next) {
    try {
      if (!req.body.productId) {
        throw new Error('Missing productId');
      }

      const product = await productService.findById(req.body.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const paymentPayload = {
        userId: req.user.id,
        productId: req.body.productId,
      };

      let payment = await paymentService.create(paymentPayload);

      const checkoutPayload = {
        paymentId: payment.id,
        name : product.name,
        quantity: req.body.quantity,
        price: product.price * 100,
        image: req.body.image,
      };

      const checkout = await stripePayment.createCheckout(checkoutPayload);

      const finalPayment = await paymentService.update(
        { id: parseInt(payment.id) },
        {
          sessionId: checkout.id,
          checkoutUrl: checkout.url,
        },
      );

      res.status(201).json(finalPayment);
    } catch (err) {
      next(err);
    }
  },
};
