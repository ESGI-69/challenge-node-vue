import { ChatMessage, User } from '../db/index.js';
// import { io } from '../index.js';

export default {
  /**
   * Find all chat messages matching the criteria
   * @param {import('sequelize').WhereOptions} criteria
   * @returns
   */
  findAll: (criteria) => {
    return ChatMessage.findAll({
      where: criteria,
      include: [{
        model: User,
        as: 'user',
      }],
    });
  },

  /**
   * Create a new chat message
   * @param {Object} chatMessage
   */
  create: (chatMessage) => {
    return ChatMessage.create(chatMessage);
  },

  /**
   * Delete a chat message
   * @param {number} id
   * @returns
   */
  delete: (id) => {
    return ChatMessage.destroy({
      where: { id },
    });
  },
};

