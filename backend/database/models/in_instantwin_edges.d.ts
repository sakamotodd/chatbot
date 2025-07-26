import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
interface InInstantwinEdgeAttributes {
    id: number;
    template_id: number;
    prize_id: number;
    source_node_id: number;
    target_node_id: number;
    condition_data?: object;
    created: Date;
    modified: Date;
}
interface InInstantwinEdgeCreationAttributes extends Optional<InInstantwinEdgeAttributes, 'id' | 'created' | 'modified'> {
}
declare class InInstantwinEdge extends Model<InInstantwinEdgeAttributes, InInstantwinEdgeCreationAttributes> implements InInstantwinEdgeAttributes {
    id: number;
    template_id: number;
    prize_id: number;
    source_node_id: number;
    target_node_id: number;
    condition_data?: object;
    created: Date;
    modified: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare function createInInstantwinEdgeModel(sequelize: Sequelize, dataTypes: typeof DataTypes): typeof InInstantwinEdge;
export { InInstantwinEdge, InInstantwinEdgeAttributes, InInstantwinEdgeCreationAttributes };
