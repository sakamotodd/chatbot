import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
export declare enum TemplateType {
    START = 0,
    MESSAGE = 1,
    TREE = 2,
    LOTTERY_GROUP = 3,
    END = 4
}
interface InInstantwinTemplateAttributes {
    id: number;
    prize_id: number;
    name?: string;
    type: TemplateType;
    step_order: number;
    is_active: boolean;
    created: Date;
    modified: Date;
}
interface InInstantwinTemplateCreationAttributes extends Optional<InInstantwinTemplateAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinTemplate extends Model<InInstantwinTemplateAttributes, InInstantwinTemplateCreationAttributes> implements InInstantwinTemplateAttributes {
    id: number;
    prize_id: number;
    name?: string;
    type: TemplateType;
    step_order: number;
    is_active: boolean;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinTemplateModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinTemplate;
export { InInstantwinTemplate, InInstantwinTemplateAttributes, InInstantwinTemplateCreationAttributes };
