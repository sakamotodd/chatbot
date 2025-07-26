import { Sequelize } from 'sequelize';
import db from '../../../database/models';

export const sequelize: Sequelize = db.sequelize;

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('データベース接続に成功しました。');
  } catch (error) {
    console.error('データベース接続に失敗しました:', error);
    process.exit(1);
  }
};

export const syncDatabase = async (
  options = { force: false }
): Promise<void> => {
  try {
    await sequelize.sync(options);
    console.log('データベースの同期が完了しました。');
  } catch (error) {
    console.error('データベースの同期に失敗しました:', error);
    throw error;
  }
};

export default sequelize;
