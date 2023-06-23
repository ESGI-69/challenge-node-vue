import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import syncMongo from './../syncMongo';
import Sequelize, { DataTypes, Model } from 'sequelize';
import mongoose, { Schema } from 'mongoose';
import { config } from 'dotenv';
config({
  path: './../.env',
});

describe('Sequelize hooks should replicate the Postgres state', () => {
  /**
   * Sequelize connection
   * @type {import('sequelize').Sequelize}
   */
  let connection;

  /**
   * Mongoose connection
   * @type {import('mongoose').Mongoose}
   */
  let mongoConnection;

  // Define a Sequelize model for testing
  class TestModel extends Model {
    static mongoSchema = new Schema({
      id: { type: Number, required: true, unique: true },
      name: String,
    });
  }

  beforeAll(async () => {
    // Connect to MongoDB
    mongoConnection = await mongoose.connect(`mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@localhost:27017/test`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin',
    });

    // Connect to Postgres
    connection = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`, {
      logging: false,
    });

    // Authenticate with Postgres
    await connection.authenticate();

    // Initialize the Sequelize model
    TestModel.init(
      {
        name: DataTypes.STRING,
      },
      { sequelize: connection, tableName: 'testmodels' },
    );
  });


  afterAll(async () => {
    // Disconnect from MongoDB
    await mongoConnection.disconnect();

    // Disconnect from Postgres
    await connection.close();
  });

  beforeEach(async () => {
    // Reset the MySQL table before each test
    await TestModel.sync({ force: true });

    const isCollectionExist = (await mongoConnection.connection.db.listCollections({ name: 'testmodels' }).toArray()).length > 0;
    if (isCollectionExist) {
      // Clear the MongoDB collection before each test
      await mongoConnection.connection.db.dropCollection('testmodels');
    }
  });

  it('should replicate the data on startup', async () => {
    // Create a row in the MySQL table
    const testRow = await TestModel.create({ name: 'Startup test' });

    // Call the syncMongo function with the test model
    await syncMongo([TestModel], connection);

    // Check that the row exists in MongoDB
    const testDoc = await mongoose.model('testmodel', TestModel.mongoSchema).findOne({
      id: testRow.id,
    });
    expect(testDoc).toMatchObject({ id: testRow.id, name: 'Startup test' });
  });

  it('should replicate data on create', async () => {
    // Call the syncMongo function with the test model and schema
    await syncMongo([TestModel], connection);

    // Create a row in the MySQL table
    const testRow = await TestModel.create({ name: 'Test sync on create' });

    // Wait for the row to be replicated to MongoDB
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check that the row exists in MongoDB
    const testDoc = await mongoose.model('testmodel', TestModel.mongoSchema).findOne({
      id: testRow.id,
    });
    expect(testDoc).toMatchObject({ id: testRow.id, name: 'Test sync on create' });
  });

  it('should replicate data on update', async () => {
    // Call the syncMongo function with the test model and schema
    await syncMongo([TestModel], connection);

    // Create a row in the MySQL table
    const testRow = await TestModel.create({ name: 'Test sync on update' });

    // Wait for the row to be replicated to MongoDB
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Update the row in the MySQL table
    await TestModel.update({ name: 'Test sync on update (updated)' }, { where: { id: testRow.id } });

    // Wait for the row to be replicated to MongoDB
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check that the row exists in MongoDB
    const testDoc = await mongoose.model('testmodel', TestModel.mongoSchema).findOne({
      id: testRow.id,
    });
    expect(testDoc).toMatchObject({ id: testRow.id, name: 'Test sync on update (updated)' });
  });

  it('should replicate data on delete', async () => {
    // Call the syncMongo function with the test model and schema
    await syncMongo([TestModel], connection);

    // Create a row in the MySQL table
    const testRow = await TestModel.create({ name: 'Test sync on delete' });

    // Wait for the row to be replicated to MongoDB
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Delete the row in the MySQL table
    await TestModel.destroy({ where: { id: testRow.id } });

    // Wait for the row to be replicated to MongoDB
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Check that the row does not exist in MongoDB
    const testDoc = await mongoose.model('testmodel', TestModel.mongoSchema).findOne({
      id: testRow.id,
    });
    expect(testDoc).toBeNull();
  });
});
