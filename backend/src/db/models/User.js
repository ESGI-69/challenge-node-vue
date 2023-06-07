import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import mailer from '../../utils/mailer.js';

import { Card, User_Card } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */
export default (connection) => {
  class User extends Model {
    static associate() {
      this.belongsToMany(Card, { through: User_Card, foreignKey: 'userId' });
    }

    /**
     * Check if the given password is correct
     * @param {string} password User plain password
     * @returns {Promise<boolean>}
     */
    checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }

    /**
     * Generate a JWT token for the user
     * @returns {string} JWT token
     */
    generateToken() {
      return jwt.sign({ id: this.id }, 'JWT_SECRET', { expiresIn: '1y' });
    }

    /**
     * Check if the user is an admin
     * @returns {boolean}
     */
    isAdmin() {
      return this.role === 'ADMIN';
    }

    /**
     * Check if the user has enough balance from the given amount
     * @param {number} amount Amount to check
     * @returns {boolean}
     */
    hasEnoughBalance(amount) {
      return this.balance >= amount;
    }
  }

  User.init(
    {
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default.png',
        validate: {
          notEmpty: true,
        }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isNotNull: function (value) {
            if (value === null) {
              throw new Error('Email cannot be null');
            }
          },
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
          is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        },
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'PLAYER'),
        allowNull: false,
        defaultValue: 'PLAYER',
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      mailToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'users',
      defaultScope: {
        attributes: { exclude: ['password', 'avatar'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
        withAvatar: {
          attributes: { include: ['avatar'] },
        },
      },
    }
  );

  /**
   * Encrypt the password before creating or updating the user
   * @param {User} user User model
   * @param {import('sequelize').UpdateOptions} [options] Update options
   */
  const encryptPassword = async (user, options) => {
    if (!options?.fields.includes('password')) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  };

  /**
   * Delete the avatar from the server
   * @param {User} user User model
   * @param {import('sequelize').UpdateOptions} [options] Update options
   * @returns
   */
  const deleteAvatar = ({ avatar }, options) => {
    if (options && !options.fields.includes('avatar')) {
      return;
    }
    if (avatar !== 'default.png') {
      const avatarPath = path.join(process.env.PWD, 'public', 'profile-pictures', avatar);
      fs.unlinkSync(avatarPath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  };

  const mailToken = (user, options) => {
    if (!options?.fields.includes('mailToken')) {
      return;
    }
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.mailToken = `${randomString}${Date.now()}`;
  };

  const sendConfirmationEmail = async (user, options) => {
    if (!options?.fields.includes('mailToken')) {
      return;
    }
    console.log('sendConfirmationEmail');
    const url = `${process.env.FRONTEND_URL}/confirm/${user.mailToken}`;
    const html = `<p>Please confirm your email by clicking <a href="${url}">here</a>.</p>`;
    try {
      await mailer(user.email, 'Confirm your email', html);
    } catch (err) {
      console.error(err);
    }

  };


  User.addHook('beforeCreate', encryptPassword);

  User.addHook('beforeUpdate', encryptPassword);

  // Remove password & avatar from the return value after the user is created
  User.addHook('afterCreate', (user) => {
    delete user.dataValues.password;
    delete user.dataValues.avatar;
  });

  // Remove password & avatar from the return value after the user is updated
  User.addHook('afterUpdate', (user) => {
    delete user.dataValues.password;
    delete user.dataValues.avatar;
  });

  // Remove profile picture from the server when the user is updated
  User.addHook('beforeUpdate', deleteAvatar);

  // Remove profile picture from the server when the user is deleted
  User.addHook('afterDestroy', deleteAvatar);

  // Create a random token for the user when it is created
  User.addHook('beforeCreate', mailToken);

  // Send a confirmation email to the user with the token when it is created
  User.addHook('afterCreate', sendConfirmationEmail);

  return User;
};
