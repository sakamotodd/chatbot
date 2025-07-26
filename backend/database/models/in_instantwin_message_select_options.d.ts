import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
interface InInstantwinMessageSelectOptionAttributes {
    id: number;
    node_id: number;
    parent_node_id?: number;
    prize_id: number;
    select_option: string;
    option_value?: string;
    display_order: number;
    created: Date;
    modified: Date;
}
interface InInstantwinMessageSelectOptionCreationAttributes extends Optional<InInstantwinMessageSelectOptionAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinMessageSelectOption extends Model<InInstantwinMessageSelectOptionAttributes, InInstantwinMessageSelectOptionCreationAttributes> implements InInstantwinMessageSelectOptionAttributes {
    id: number;
    node_id: number;
    parent_node_id?: number;
    prize_id: number;
    select_option: string;
    option_value?: string;
    display_order: number;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinMessageSelectOptionModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinMessageSelectOption;
export { InInstantwinMessageSelectOption, InInstantwinMessageSelectOptionAttributes, InInstantwinMessageSelectOptionCreationAttributes };
