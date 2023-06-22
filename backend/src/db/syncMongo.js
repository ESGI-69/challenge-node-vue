import { Model } from 'sequelize';
import mongoose from 'mongoose';

/**
 * Syncronize MongoDB with MySQL database
 * @param {import('sequelize').Model[]} models Sequelize models
 * @param {import('sequelize').Sequelize} sequelize Sequelize connection
 */
export default async(models, sequelize) => {
// Add nessessary methods and properties to models for automatic mongo initialization
  Model.mongoModel = null;
  /**
   * Initialize mongo model
   */
  Model.initMongo = function () {
    if (!this.mongoSchema) {
      console.warn('🚨🚨🚨 mongoSchema is not defined. You should define it in his model file for automactic initialization');
      throw new Error('mongoSchema is not defined');
    }
    if (this.mongoModel) return;
    this.mongoModel = mongoose.model(this.name, this.mongoSchema, this.tableName);
  };
  /**
   * Add a row to MongoDB
   * @param {import('mongoose').Model} item
   */
  Model.addToMongo = async function (item) {
    this.initMongo();
    await this.mongoModel.findOneAndUpdate(
      { id: item.id },
      item.toJSON(),
      { upsert: true },
    );
  };
  Model.updateToMongo = async function (id, itemObject) {
    this.initMongo();
    await this.mongoModel.findOneAndUpdate(
      { id },
      itemObject,
    );
  };
  /**
   * Remove a row from MongoDB
   * @param {string} id Row id
   */
  Model.removeFromMongo = async function (id) {
    this.initMongo();
    await this.mongoModel.findOneAndDelete({ id });
  };

  sequelize.addHook('afterCreate', async function (item) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    await this.addToMongo(item);
  });

  sequelize.addHook('afterBulkUpdate', async function (options) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    await this.updateToMongo(options.where.id, options.attributes);
  });

  sequelize.addHook('afterBulkDestroy', async function (options) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    await this.removeFromMongo(options.where.id);
  });

  // Loop through all models
  for (const model of models) {
    try {
      /* eslint-disable-next-line no-console */
      console.log(`Syncing ${model.name} with MongoDB...`);
      // Get all rows from MySQL table
      const rows = await model.findAll();
      // Loop through all rows
      for (const row of rows) {
        await model.addToMongo(row);
        // Create a new document in MongoDB
      }
    } catch (err) {
      continue;
    }
  }
};
