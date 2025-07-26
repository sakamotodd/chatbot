import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CampaignAttributes {
  id: number;
  title: string;
  description?: string;
  status: string;
  start_date?: Date;
  end_date?: Date;
  created: Date;
  modified: Date;
}

interface CampaignCreationAttributes extends Optional<CampaignAttributes, 'id' | 'created' | 'modified'> {}

class Campaign extends Model<CampaignAttributes, CampaignCreationAttributes> implements CampaignAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public status!: string;
  public start_date?: Date;
  public end_date?: Date;
  public created!: Date;
  public modified!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createCampaignModel(sequelize: Sequelize, dataTypes: typeof DataTypes) {
  Campaign.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: dataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'draft',
      },
      start_date: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      created: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
      },
      modified: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'campaigns',
      timestamps: false,
      hooks: {
        beforeUpdate: (campaign: Campaign) => {
          campaign.modified = new Date();
        },
      },
    }
  );

  return Campaign;
}

export { Campaign };
export type { CampaignAttributes, CampaignCreationAttributes };