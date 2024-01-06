// Import necessary Sequelize modules
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database.js';

// Define the Setting model class
class Setting extends Model {}

// Initialize the Setting model with the sequelize instance and define attributes
Setting.init(
  {
    // Define model attributes here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repoName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repoOwner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    openAiSecret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the sequelize instance
    modelName: 'Setting', // Set the model name
  }
);

// Export the Setting class to use in other parts of your application
export default Setting;
