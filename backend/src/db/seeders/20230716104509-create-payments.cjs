'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('payments', [
      {
        userId: 1,
        productId: 1,
        status: 'PAID',
        isCredited: true,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 1,
        productId: 2,
        status: 'CANCELED',
        isCredited: false,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 2,
        productId: 1,
        status: 'CANCELED',
        isCredited: false,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 2,
        productId: 1,
        status: 'PENDING',
        isCredited: false,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 2,
        productId: 2,
        status: 'PAID',
        isCredited: true,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 3,
        productId: 1,
        status: 'PENDING',
        isCredited: false,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 3,
        productId: 1,
        status: 'PAID',
        isCredited: true,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 3,
        productId: 1,
        status: 'CANCELED',
        isCredited: false,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 5,
        productId: 1,
        status: 'CANCELED',
        isCredited: false,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 5,
        productId: 2,
        status: 'PAID',
        isCredited: true,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
      {
        userId: 5,
        productId: 1,
        status: 'PENDING',
        isCredited: false,
        sessionId: 'test-session-id',
        checkoutUrl: 'test-checkout-url',
        createdAt: new Date(),
      },
    ]);
  },

  async down (queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('payments', null, {});
  },
};
