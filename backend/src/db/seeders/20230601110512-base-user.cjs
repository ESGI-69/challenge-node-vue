'use strict';

const bcrypt = require('bcryptjs');

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
    await queryInterface.bulkInsert('users', [
      {
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'PLAYER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'janedoe@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'PLAYER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'Admin',
        lastname: 'Pro',
        email: 'admin@example.com',
        password: await bcrypt.hash('123456', 10),
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: 'User',
        lastname: 'Unverified',
        email: 'unverified@mail.com',
        mailToken: 'tokennnnnnnnnnn',
        password: await bcrypt.hash('123456', 10),
        role: 'PLAYER',
        createdAt: new Date(),
        updatedAt: new Date(),
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
    await queryInterface.bulkDelete('Users', null, {});
  },
};
