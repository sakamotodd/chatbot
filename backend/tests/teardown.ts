import { sequelize } from '../src/server/utils/database';

module.exports = async () => {
  // Close database connections after all tests
  if (sequelize) {
    await sequelize.close();
  }
};