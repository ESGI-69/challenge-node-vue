import { DataTypes, Model } from 'sequelize';
import { Message_Report, User } from '../index.js';

export default (connection) => {
  class ChatMessage extends Model {
    static associate() {
      this.belongsTo(User, { through: User, foreignKey: 'userId', as: 'user' });
      this.belongsToMany(Message_Report, { through: Message_Report, foreignKey: 'messageId' });
    }
  }

  ChatMessage.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isReportedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'chat_messages',
    },
  );
  return ChatMessage;
};
