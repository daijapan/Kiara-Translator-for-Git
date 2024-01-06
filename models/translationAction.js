// Import necessary Sequelize modules
import { DataTypes, Model } from 'sequelize';
import Setting from './setting.js';
import { sequelize } from '../db/database.js';

// Define the Action model class
class TranslationAction extends Model {}

// Initialize the Action model with the sequelize instance and define attributes
TranslationAction.init(
  {
    // Define model attributes here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    delay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nextRun: {
      type: DataTypes.DATE,
      allowNull: true,
    },   
  },
  {
    sequelize, // Pass the sequelize instance
    modelName: 'TranslationAction', // Set the model name
  }
);

TranslationAction.belongsTo(Setting, { foreignKey: 'settingId' });

// Export the Action class to use in other parts of your application
export default TranslationAction;
