import chatMessageService from '../services/chatMessage.js';
import { io } from '../index.js';

export default {
  /**
   * Express.js controller for POST /chat-messages
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  post: async (req, res, next) => {
    try {
      const content = req.body.content;
      const userId = req.user.id;

      const chatMessage = await chatMessageService.create({ content, userId });

      io.emit('chat:message', chatMessage);

      return res.status(201).json(chatMessage);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Express.js controller for GET /chat-messages
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  cget: async (req, res, next) => {
    try {
      const chatMessages = await chatMessageService.findAll();
      return res.status(200).json(chatMessages);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Express.js controller for DELETE /chat-messages/:id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      await chatMessageService.delete(id);
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};
