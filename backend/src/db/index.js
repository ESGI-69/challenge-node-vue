import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import syncMongo from './syncMongo.js';

import card from './models/Card.js';
import pack from './models/Pack.js';
import pack_Card from './models/PackCard.js';
import user from './models/User.js';
import user_Card from './models/UserCard.js';
import game from './models/Game.js';
import product from './models/Product.js';
import payment from './models/Payment.js';
import deck from './models/Deck.js';
import deck_Card from './models/DeckCard.js';
import hand_Card from './models/HandCard.js';
import hand from './models/Hand.js';
import cardInstance from './models/CardInstance.js';
import board from './models/Board.js';
import board_CardInstance from './models/BoardCardInstance.js';
import chatMessage from './models/ChatMessage.js';

/**
 * The domain name of the postgres database
 * @type {'127.0.0.1' | 'postgres'}
 */
let postgresDomainName  = '127.0.0.1';
/**
 * The domain name of the mongodb database
 * @type {'127.0.0.1' | 'mongo'}
 */
let mongoDomainName = '127.0.0.1';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './../.env' });
} else {
  postgresDomainName = 'postgres';
  mongoDomainName = 'mongo';
}

/**
 * Sequelize connection
 * @type {import('sequelize').Sequelize}
 */
const connection = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${postgresDomainName}:5432/${process.env.POSTGRES_DB}`, {
  logging: false,
});

await mongoose.connect(`mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@${mongoDomainName}:27017/${process.env.MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin',
});

// Load models
const Card = card(connection);
const Pack = pack(connection);
const Pack_Card = pack_Card(connection);
const User = user(connection);
const User_Card = user_Card(connection);
const Game = game(connection);
const Product = product(connection);
const Payment = payment(connection);
const Deck = deck(connection);
const Deck_Card = deck_Card(connection);
const Hand_Card = hand_Card(connection);
const Hand = hand(connection);
const CardInstance = cardInstance(connection);
const Board = board(connection);
const Board_CardInstance = board_CardInstance(connection);
const ChatMessage = chatMessage(connection);

// Launch associations methods for relations between tables
User.associate();
Card.associate();
Pack.associate();
Game.associate();
Product.associate();
Payment.associate();
Deck.associate();
Hand.associate();
CardInstance.associate();
Board.associate();
ChatMessage.associate();

// Syncronize MongoDB with MySQL database, create documents in MongoDB for each row in MySQL. Do not pass junction tables to syncMongo
await syncMongo(
  [
    Card,
    Pack,
    User,
    Game,
    Product,
    Payment,
    Deck,
    Hand,
    CardInstance,
    Board,
    ChatMessage,
  ],
  connection,
);

export {
  Card,
  connection,
  Pack,
  Pack_Card,
  User_Card,
  Deck_Card,
  User,
  Game,
  Product,
  Payment,
  Deck,
  Hand_Card,
  Hand,
  CardInstance,
  Board,
  Board_CardInstance,
  ChatMessage,
};
