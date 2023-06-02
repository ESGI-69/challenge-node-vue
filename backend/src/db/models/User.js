import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @param {import('sequelize').Sequelize} connection
 */
export default (connection) => {
  class User extends Model {
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
  }

  User.init(
    {
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
    },
    {
      sequelize: connection,
      tableName: 'users',
    }
  );

  /**
   * Encrypt the password before creating or updating the user
   * @param {User} user User model
   * @param {import('sequelize').UpdateOptions} options 
   */
  const encryptPassword = async (user, options) => {
    if (!options?.fields.includes('password')) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  };

  User.addHook('beforeCreate', encryptPassword);

  User.addHook('beforeUpdate', encryptPassword);
  
  return User;
};
