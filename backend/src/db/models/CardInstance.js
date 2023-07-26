import { Board, Card } from '../index.js';
import { DataTypes, Model } from 'sequelize';

/**
 * @param {import('sequelize').Sequelize} connection
 */

export default (connection) => {
  class CardInstance extends Model {
    static associate() {
      CardInstance.belongsTo(Board, {
        foreignKey: 'game_board_id',
      });
      CardInstance.belongsTo(Card, {
        foreignKey: 'card_id',
        as: 'card',
      });
    }
  }

  CardInstance.init(
    {
      currentHealth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      allreadyAttacked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      sequelize: connection,
      tableName: 'card_instances',
      hooks: {
        afterCreate: async (cardInstance) => {
          const card = await Card.findByPk(cardInstance.card_id);
          cardInstance.currentHealth = card.health;
          await cardInstance.save();
        },
      },
      getterMethods: {
        isDead() {
          return this.currentHealth <= 0;
        },
      },
    },
  );
  return CardInstance;
};
