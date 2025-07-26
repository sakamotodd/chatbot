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
interface CampaignCreationAttributes extends Optional<CampaignAttributes, 'id' | 'created' | 'modified'> {
}
declare class Campaign extends Model<CampaignAttributes, CampaignCreationAttributes> implements CampaignAttributes {
    id: number;
    title: string;
    description?: string;
    status: string;
    start_date?: Date;
    end_date?: Date;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createCampaignModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Campaign;
export { Campaign, CampaignAttributes, CampaignCreationAttributes };
