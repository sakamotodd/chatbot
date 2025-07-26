// Mock database utilities for testing without real database connection
import { Sequelize } from 'sequelize';

let sequelize: Sequelize;

export const setupMockDatabase = () => {
  // Use SQLite in-memory database for testing
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
    dialect: 'sqlite'
  });
  
  return sequelize;
};

export const closeMockDatabase = async () => {
  if (sequelize) {
    await sequelize.close();
  }
};

export const getMockSequelize = () => sequelize;