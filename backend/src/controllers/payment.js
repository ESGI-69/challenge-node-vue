// import paymentService from '../services/payment';
import stripePayment from '../utils/stripePayment.js';
import paymentService from '../services/payment.js';
import productService from '../services/product.js';
import userService from '../services/user.js';

export default {
  /**
   * Express.js controller GET /payments
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async cget(req, res, next) {
    try {
      res.json(await paymentService.findAll({ userId: req.user.id }));
    } catch (err) {
      next(err);
    }
  },

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
        throw new Error('Product not found', { cause: 'Not Found' });
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

  /**
   * Express.js controller PATCH /payment/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async patch(req, res, next) {
    try {
      let paymentStatus = 'CANCELED';

      if (!req.params.id || typeof req.params.id !== 'string') {
        throw new Error('Payment not found', { cause: 'Not Found' });
      }

      const payment = await paymentService.findByIdWithSessionId(req.params.id);
      if (!payment || payment.userId !== req.user.id) {
        throw new Error('Payment not found', { cause: 'Not Found' });
      }

      if (payment.isCredited) {
        throw new Error('Payment already credited');
      }

      const checkout = await stripePayment.retrieveCheckout(payment.sessionId);
      if (checkout.payment_status === 'paid') {
        paymentStatus = 'PAID';
        const product = await productService.findById(payment.productId);
        await userService.addMoney(req.user, product.value);
        await paymentService.update(
          { id: parseInt(payment.id) },
          { isCredited: true },
        );
      }

      if (checkout.status === 'expired') {
        throw new Error('Payment expired');
      }

      if (checkout.status !== 'complete') {
        await stripePayment.closeCheckout(payment.sessionId);
      }

      const paymentUpdate = await paymentService.update(
        { id: parseInt(payment.id) },
        { status: paymentStatus },
      );

      res.status(200).json(paymentUpdate);

    } catch (err) {
      next(err);
    }
  },

  /**
   * Express.js controller GET /payments/admin
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async cgetAdmin(req, res, next) {
    try {
      if (!req.user.isAdmin) {
        throw new Error('Forbidden');
      }

      res.json(await paymentService.findAllWithSessionId({}));
    } catch (err) {
      next(err);
    }
  },
};
