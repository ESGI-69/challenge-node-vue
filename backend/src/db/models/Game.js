import { DataTypes, Model } from 'sequelize';

import { User } from '../index.js';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Game extends Model {
    static associate() {
        this.belongsTo(User, { through: User, foreignKey: 'first_player' });
        this.belongsTo(User, { through: User, foreignKey: 'second_player' });
    }
  }

    Game.init(
        {
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            winner: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    notEmpty: true
                }
            }
        },
        {
            sequelize: connection,
            tableName: 'games',
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
      scopes: {
                withTimestamps: { attributes: {
                    include: ['createdAt', 'updatedAt']
                } },
            },
        }
    );
    return Game;

            
}
