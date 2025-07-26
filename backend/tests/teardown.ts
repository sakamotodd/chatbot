import { sequelize } from '../database/config';

module.exports = async () => {
  // Close database connections after all tests
  if (sequelize) {
    await sequelize.close();
  }
};