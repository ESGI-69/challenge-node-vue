import gameService from '../services/game.js';
import userService from '../services/user.js';
import { Server as SocketIoServer } from 'socket.io';
// import userService from '../services/user';
import { io } from '../index.js';


export default {
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

            let socketId = null;
            socketId = req.body.socketId;
        
            let user = await userService.findById(req.user.id);
            const currentGame  = await gameService.findByUserId(user);

            if (currentGame) {
                // res.status(400).json({ message: 'You are already in a game' });
                // return the current Game 

                // join the room or create it if it doesn't exist
                // game already exists so it should create a room and join it
                let playerSocket = io.sockets.sockets.get(socketId);
                if (!playerSocket) {
                    throw new Error('not connected to socket io')
                }else{
                    playerSocket.join(currentGame.token);
                }

                res.status(201).json(currentGame);
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

            // create a room and make the socketId join it
            let playerSocket = io.sockets.sockets.get(socketId);
            if(!playerSocket){
                throw new Error('not connected to socket io');
            }else{
                playerSocket.join(generatedToken);
            }

            res.status(201).json(game);
        }
        catch (err) {
            // res.status(400).json({ error: err.message });
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
    },

    leaveGame: async (req, res, next) => {
        if (!req.body.socketId) throw new Error('You need to provide your socket id');
        try {
            // check if the game id is in the database with the req.user.id in the first_player or second_player
            let user = await userService.findById(req.user.id);
            if(!user) throw new Error('User not found');
            const currentGame = await gameService.findByUserId(user);
            let socketId = req.body.socketId;
            let roomId = null;
            if(currentGame.length === 0) {
                res.status(404).json({ error: 'You are not in a game' });
                return;
            }
            // return res.status(200).json(req);
            // if the game has the user id
            if(currentGame && (currentGame.first_player === user.id || currentGame.second_player === user.id)) {
                const nbRemoved = await gameService.remove({
                    id: parseInt(req.params.id)
                })
                res.sendStatus(nbRemoved ? 204 : 404)

                // leave the room
                let playerSocket = io.sockets.sockets.get(socketId);
                roomId = currentGame.token;
                playerSocket.leave(roomId);

            }else{
                // L'user essaie de quitter une game dans laquelle il n'est pas
                res.status(403).json({ error: 'You are not permitted to leave this game' });
            }
        } catch (err) {
            next(err)
        }
    }
};

