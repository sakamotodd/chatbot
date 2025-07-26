import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
export declare enum MessageType {
    TEXT = 0,
    MEDIA = 1,
    CARD = 2,
    SELECT = 3
}
interface InInstantwinMessageAttributes {
    id: number;
    node_id: number;
    prize_id: number;
    text?: string;
    message_type: MessageType;
    media_id?: number;
    media_url?: string;
    metadata?: object;
    created: Date;
    modified: Date;
}
interface InInstantwinMessageCreationAttributes extends Optional<InInstantwinMessageAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinMessage extends Model<InInstantwinMessageAttributes, InInstantwinMessageCreationAttributes> implements InInstantwinMessageAttributes {
    id: number;
    node_id: number;
    prize_id: number;
    text?: string;
    message_type: MessageType;
    media_id?: number;
    media_url?: string;
    metadata?: object;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinMessageModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinMessage;
export { InInstantwinMessage, InInstantwinMessageAttributes, InInstantwinMessageCreationAttributes };
