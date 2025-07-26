import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
interface InInstantwinMessageCardButtonAttributes {
    id: number;
    message_card_id: number;
    button_title: string;
    button_url?: string;
    button_type: string;
    display_order: number;
    created: Date;
    modified: Date;
}
interface InInstantwinMessageCardButtonCreationAttributes extends Optional<InInstantwinMessageCardButtonAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinMessageCardButton extends Model<InInstantwinMessageCardButtonAttributes, InInstantwinMessageCardButtonCreationAttributes> implements InInstantwinMessageCardButtonAttributes {
    id: number;
    message_card_id: number;
    button_title: string;
    button_url?: string;
    button_type: string;
    display_order: number;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinMessageCardButtonModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinMessageCardButton;
export { InInstantwinMessageCardButton, InInstantwinMessageCardButtonAttributes, InInstantwinMessageCardButtonCreationAttributes };
