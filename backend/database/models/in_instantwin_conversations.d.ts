import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
interface InInstantwinConversationAttributes {
    id: number;
    campaign_id: number;
    prize_id: number;
    template_id?: number;
    current_node_id?: number;
    instagram_user_id: string;
    sender_id?: number;
    message_text?: string;
    message_timestamp: Date;
    is_from_user: boolean;
    is_first_trigger: boolean;
    is_last_trigger: boolean;
    session_data?: object;
    created: Date;
    modified: Date;
}
interface InInstantwinConversationCreationAttributes extends Optional<InInstantwinConversationAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinConversation extends Model<InInstantwinConversationAttributes, InInstantwinConversationCreationAttributes> implements InInstantwinConversationAttributes {
    id: number;
    campaign_id: number;
    prize_id: number;
    template_id?: number;
    current_node_id?: number;
    instagram_user_id: string;
    sender_id?: number;
    message_text?: string;
    message_timestamp: Date;
    is_from_user: boolean;
    is_first_trigger: boolean;
    is_last_trigger: boolean;
    session_data?: object;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinConversationModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinConversation;
export { InInstantwinConversation, InInstantwinConversationAttributes, InInstantwinConversationCreationAttributes };
