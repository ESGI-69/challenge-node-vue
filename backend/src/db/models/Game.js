import { DataTypes, Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class Game extends Model {

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
            first_player: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            second_player: {
                type: DataTypes.INTEGER,
                allowNull: true,
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