import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
export declare enum NodeType {
    FIRST_TRIGGER = 0,
    MESSAGE = 1,
    MESSAGE_SELECT_OPTION = 2,
    LOTTERY = 3,
    LOTTERY_MESSAGE = 4
}
interface InInstantwinNodeAttributes {
    id: number;
    template_id: number;
    prize_id: number;
    type: NodeType;
    created: Date;
    modified: Date;
}
interface InInstantwinNodeCreationAttributes extends Optional<InInstantwinNodeAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinNode extends Model<InInstantwinNodeAttributes, InInstantwinNodeCreationAttributes> implements InInstantwinNodeAttributes {
    id: number;
    template_id: number;
    prize_id: number;
    type: NodeType;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinNodeModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinNode;
export { InInstantwinNode, InInstantwinNodeAttributes, InInstantwinNodeCreationAttributes };
