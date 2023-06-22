import gameService from '../services/game.js';
// import userService from '../services/user';

export default {
    /**
     * Express.js controller for GET /games
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     * */
    cget: async (req, res, next) => {
        const {
            _page = 1,
            _itemsPerPage = 10,
            _sort = {},
            ...criteria
        } = req.query;
        try {
            const games = await gameService.findAll(criteria, {
                offset: (_page - 1) * _itemsPerPage,
                limit: _itemsPerPage,
                order: _sort,
            });
            res.json(games);
        }
        catch (err) {
            next(err);
        }
    },
    /**
     * Express.js controller for POST /games
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     * */
    post: async (req, res, next) => {
        // req.user
        // Pour l'instant, on part du principe que le joueur ne peut être que dans une game tant qu'il ne l'a pas quitté
        // Donc on vérifie qu'il n'est pas déjà dans une game
        try {

            const currentGame = await gameService.findByUserId(req.user.id);

            if (currentGame.length > 0) {
                res.status(400).json({ message: 'You are already in a game' });
                return;
            }

            // generate a token for the game 
            let generatedToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            const gamePayload = {
                token: generatedToken,
                first_player: req.user.id,
                second_player: null,
                winner: null,
            };
            const game = await gameService.create(gamePayload);
            res.status(201).json(game);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
            next(err);
        }
    },
    /**
     * Express.js controller for GET /games/:id
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     * */
    get: async (req, res, next) => {
        try {
            const game = await gameService.findById(req.params.id);
            res.json(game);
        }
        catch (err) {
            next(err);
        }
    },
    /**
     * Express.js controller for PUT /games/:id
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<void>}
     * */
    put: async (req, res, next) => {
        try {
            await gameService.validate(req.body);

            const nbRemoved = await gameService.remove({
                id: parseInt(req.params.id)
            });
            const game = await gameService.create({
                id: parseInt(req.params.id),
                ...req.body
            });
            res.status(nbRemoved ? 200: 201).json(game);
        } catch (err) {
            next(err);
        }
    },
    /**
     * Express.js controller for PATCH /games/:id
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @param {import('express').NextFunction} next
    * @returns {Promise<void>}
    */

    patch: async (req, res, next) => {
        try {
            const [game] = await gameService.update(
                { id: parseInt(req.params.id) },
                req.body
            );
            if (!game) return res.sendStatus(404);
            res.json(game);
        } catch (err) {
            next(err);
        }
    },
    /**
     * Express.js controller for DELETE /games/:id
     * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
    delete: async (req, res, next) => {
        try {
            const nbRemoved = await gameService.remove({
                id: parseInt(req.params.id)
            })
            res.sendStatus(nbRemoved ? 204 : 404)
        } catch (err) {
            next(err)
        }
    } 
};

