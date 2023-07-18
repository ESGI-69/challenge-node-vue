import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import getJwt from '../../../tests/getJwt.js';
import stripePayment from '../../utils/stripePayment.js';

const playerToken = await getJwt('janedoe@example.com', '123456');

const playerId = 2;
let paymentID;

const fakeCheckoutSession = {
  id: 'cs_test_a1kLYzw1Xo4pMhQ4kGYkbKPzXFjCsnTEkP8J7ZsHiO1uAnPRTNXFZIdZ2H',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 1000,
  amount_total: 1000,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
  cancel_url: 'http://localhost:8080/shop/checkout?id=46&isSuccess=false',
  client_reference_id: null,
  consent: null,
  consent_collection: null,
  created: 1689713268,
  currency: 'eur',
  currency_conversion: null,
  custom_fields: [],
  custom_text: { shipping_address: null, submit: null },
  customer: null,
  customer_creation: 'if_required',
  customer_details: null,
  customer_email: null,
  expires_at: 1689799668,
  invoice: null,
  invoice_creation: {
    enabled: false,
    invoice_data: {
      account_tax_ids: null,
      custom_fields: null,
      description: null,
      footer: null,
      metadata: {},
      rendering_options: null,
    },
  },
  livemode: false,
  locale: null,
  metadata: {},
  mode: 'payment',
  payment_intent: null,
  payment_link: null,
  payment_method_collection: 'always',
  payment_method_options: {},
  payment_method_types: [ 'card' ],
  payment_status: 'unpaid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping_address_collection: null,
  shipping_cost: null,
  shipping_details: null,
  shipping_options: [],
  status: 'open',
  submit_type: null,
  subscription: null,
  success_url: 'http://localhost:8080/shop/checkout?id=46&isSuccess=true',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: 'https://checkout.stripe.com/c/pay/cs_test_a1kLYzw1Xo4pMhQ4kGYkbKPzXFjCsnTEkP8J7ZsHiO1uAnPRTNXFZIdZ2H#fidkdWxOYHwnPyd1blpxYHZxWjA0S1ZDf1dHPE9hb0kzfWtnPExvV2hsdlxzSEdPdzJXNFBoRkNVVGdrYXxOblRsSTdrb1B3dVRKbUFLUU9GYUx1REM1Zl1AS1dnbGQ8aE1kUVw2f25WQmdpNTU3Rml2UWE3MycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
};

describe('As an User/Player ', () => {
  let stripePaymentCreateCheckoutMock;
  let stripePaymentRetrieveCheckoutMock;
  let stripePaymentcloseCheckoutMock;

  beforeAll(() => {
    stripePaymentCreateCheckoutMock = jest.spyOn(stripePayment, 'createCheckout').mockResolvedValue(fakeCheckoutSession);
    stripePaymentRetrieveCheckoutMock = jest.spyOn(stripePayment, 'retrieveCheckout').mockResolvedValue(fakeCheckoutSession);
    stripePaymentcloseCheckoutMock = jest.spyOn(stripePayment, 'closeCheckout').mockResolvedValue();
  });

  afterAll(() => {
    stripePaymentCreateCheckoutMock.mockRestore();
    stripePaymentRetrieveCheckoutMock.mockRestore();
    stripePaymentcloseCheckoutMock.mockRestore();
  });

  it('GET /payment should only return payments from the user', () => request(app)
    .get('/payments')
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.length).toBeGreaterThanOrEqual(3);
      const paymentWithWrongUserId = response.body.find((c) => c.userId !== playerId);
      expect(paymentWithWrongUserId).toBeUndefined();
    }),
  );

  it('POST /payment should return 201', () => request(app)
    .post('/payments')
    .set('Authorization', `Bearer ${playerToken}`)
    .send({ productId: 1, quantity: 1, image: '/src/assets/coinBag.jpeg' })
    .expect(201)
    .expect('Content-Type', /json/)
    .then((response) => {
      paymentID = response.body.id;
      expect(response.body.productId).toBe(1);
      expect(response.body.userId).toBe(playerId);
      expect(response.body.checkoutUrl).toBeDefined();
    }),
  );

  it('PATCH /payment/:id should return 200', () => request(app)
    .patch(`/payments/${paymentID}`)
    .set('Authorization', `Bearer ${playerToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.status).toBe('CANCELED');
    },
    ),
  );

});

describe('As a User/Player with missing fields', () => {

  it('POST /payment should return 400 if image is missing', () => request(app)
    .post('/payments')
    .set('Authorization', `Bearer ${playerToken}`)
    .send({ productId: 1, quantity: 1 })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.reason).toBe('Not a valid URL');
    }),
  );

  it('POST /payment should return 400 if productId is missing', () => request(app)
    .post('/payments')
    .set('Authorization', `Bearer ${playerToken}`)
    .send({ quantity: 1, image: '/src/assets/coinBag.jpeg' })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.reason).toBe('Missing productId');
    }),
  );

  it('POST /payment should return 400 if quantity is missing', () => request(app)
    .post('/payments')
    .set('Authorization', `Bearer ${playerToken}`)
    .send({ productId: 1, image: '/src/assets/coinBag.jpeg' })
    .expect(400)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body.reason).toBe('Quantity is required. Add `quantity` to `line_items[0]`');
    }),
  );
});

describe('As an Unlogged User ', () => {
  it('GET /payment should return 401', () => request(app)
    .get('/payments')
    .expect(401)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );

  it('POST /payment should return 401', () => request(app)
    .post('/payments')
    .expect(401)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );

  it('PATCH /payment/:id should return 401', () => request(app)
    .patch(`/payments/${paymentID}`)
    .expect(401)
    .expect('Content-Type', /json/)
    .then((response) => {
      expect(response.body).toStrictEqual({
        code: 'not_logged_in',
        message: 'Not logged in',
      });
    }),
  );
});
