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
  Model.initMongoModel = function () {
    this.mongoModel = mongoose.model(this.name, this.mongoSchema, this.tableName);
  };

  Model.mongoSchema = null;
  /**
   * Initialize mongo schema
   */
  Model.initMongoSchema = function () {
    const attributes = Object.keys(this.getAttributes());
    let schema = {};
    attributes.forEach((attribute) => {
      const attributeObject = this.getAttributes()[attribute];
      const attributeType = attributeObject.type.toString();
      // Get attribute type
      schema[attribute] = {};
      if (attributeType === 'INTEGER') {
        schema[attribute].type = Number;
      } else if (attributeType.startsWith('VARCHAR')) {
        schema[attribute].type = String;
      } else if (attributeType === 'BOOLEAN') {
        schema[attribute].type = Boolean;
      } else if (attributeType === 'ENUM') {
        schema[attribute].type = String;
        schema[attribute].enum = attributeObject.values;
      } else if (attributeType.startsWith('TIMESTAMP')) {
        schema[attribute].type = Date;
      } else if (attributeType.startsWith('FLOAT')) {
        schema[attribute].type = Number;
      } else if (attributeType.startsWith('TEXT')) {
        schema[attribute].type = String;
      }

      // Add default values
      if (attributeObject.defaultValue) {
        schema[attribute].default = attributeObject.defaultValue;
      }

      // Add required
      if (attributeObject.allowNull === false) {
        schema[attribute].required = true;
      }

      // Add unique
      if (attributeObject.primaryKey) {
        schema[attribute].unique = true;
      }

    });

    this.mongoSchema = new mongoose.Schema(schema);
  };
  /**
   * Initialize mongo model and schema. Except for join tables.
   */
  Model.initMongo = function () {
    if (this.tableName.includes('_')) return;
    if (!this.mongoSchema) {
      this.initMongoSchema();
    }
    if (!this.mongoModel) {
      this.initMongoModel();
    }
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

  sequelize.addHook('afterCreate', function (item) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    this.addToMongo(item);
  });

  sequelize.addHook('afterBulkUpdate', function (options) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    this.updateToMongo(options.where.id, options.attributes);
  });

  sequelize.addHook('afterUpdate', function (item) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    this.updateToMongo(item.id, item.toJSON());
  });

  sequelize.addHook('afterBulkDestroy', function (options) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    this.removeFromMongo(options.where.id);
  });

  sequelize.addHook('afterDestroy', function (item) {
    // If it's a join table, don't add it to MongoDB
    if (this.tableName.includes('_')) return;
    this.removeFromMongo(item.id);
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
