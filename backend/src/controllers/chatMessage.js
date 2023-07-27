import chatMessageService from '../services/chatMessage.js';
import userService from '../services/user.js';
import { io } from '../index.js';
import { Op } from 'sequelize';

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
      const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      const hasScriptTags = regex.test(content);
      if (content.length > 250 || hasScriptTags) {
        await userService.update(
          { id: parseInt(userId) },
          { isBanned: true },
        );
        return res.status(401).json({ message: 'LMAO' });
      }

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
      io.emit('chat:message:delete', id);
      return res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Express.js controller for GET /chat-messages/reported
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  getReported: async (req, res, next) => {
    try {
      const chatMessages = await chatMessageService.findAll({
        isReportedAt: { [Op.not]: null },
      });
      return res.status(200).json(chatMessages);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Express.js controller for PATCH /chat-messages/:id/report
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  patchReport: async (req, res, next) => {
    try {
      const id = req.params.id;
      const chatMessage = await chatMessageService.update(
        { id },
        { isReportedAt: new Date() },
      );
      return res.status(200).json(chatMessage);
    } catch (error) {
      next(error);
    }
  },

  patchUnreport: async (req, res, next) => {
    try {
      const id = req.params.id;
      const chatMessage = await chatMessageService.update(
        { id },
        { isReportedAt: null },
      );
      return res.status(200).json(chatMessage);
    } catch (error) {
      next(error);
    }
  },

};
