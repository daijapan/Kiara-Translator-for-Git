import { Sequelize } from 'sequelize';
import path from 'path';
// Import necessary Sequelize modules
export const sequelize = new Sequelize('','' ,'', {
    dialect: 'sqlite',
    storage: path.resolve('db', 'database.sqlite'),
    logging: (...msg) => console.log(msg)
 })