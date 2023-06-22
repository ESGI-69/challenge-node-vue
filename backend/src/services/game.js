import { Game } from '../db/index.js';
import { Op } from 'sequelize';

export default {
    /**
     * Find all games matching the criteria
     * @param {import('sequelize').WhereOptions} criteria
     * @returns
     * */
    findAll: function (criteria) {
        return Game.findAll({
            where: criteria,
        });
    },
    findByToken: function (token) {
        return Game.findOne({
            where: {
                token: token
            }
        });
    },
    findById: function (id) {
        return Game.findByPk(id);
    },
    create: function (data) {
        return Game.create(data);
    },
    update: async function (criteria, data) {
        const [, games = []] = await Game.update(data, {
            where: criteria,
            returning: true,
            individualHooks: true, 
        });
        return games;
    },
    remove: function (criteria) {
        return Game.destroy({
            where: criteria,
        });
    },
    validate: function (data) {
        return Game.build(data).validate();
    },
    findByUserId: function (userId) {
        // if userId is first_player or second_player
        return Game.findAll({
            where: {
                [Op.or]: [
                    { first_player: userId },
                    { second_player: userId }
                ]
            }
        });
    },
        
       
}