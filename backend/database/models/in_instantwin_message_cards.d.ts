import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
interface InInstantwinMessageCardAttributes {
    id: number;
    message_id: number;
    prize_id: number;
    title: string;
    subtitle?: string;
    image_url?: string;
    card_url?: string;
    created: Date;
    modified: Date;
}
interface InInstantwinMessageCardCreationAttributes extends Optional<InInstantwinMessageCardAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinMessageCard extends Model<InInstantwinMessageCardAttributes, InInstantwinMessageCardCreationAttributes> implements InInstantwinMessageCardAttributes {
    id: number;
    message_id: number;
    prize_id: number;
    title: string;
    subtitle?: string;
    image_url?: string;
    card_url?: string;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinMessageCardModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinMessageCard;
export { InInstantwinMessageCard, InInstantwinMessageCardAttributes, InInstantwinMessageCardCreationAttributes };
