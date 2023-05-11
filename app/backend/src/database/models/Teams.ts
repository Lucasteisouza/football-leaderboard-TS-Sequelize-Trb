import { DataTypes, Model } from 'sequelize';
import db from '.';

export interface TeamsAttributes {
  id: number;
  teamName: string;
}

export type TeamsCreationAttributes = Omit<TeamsAttributes, 'id'>;

class TeamsModel extends
  Model<TeamsAttributes, TeamsCreationAttributes> implements TeamsAttributes {
  declare id: number;
  declare teamName: string;
}

TeamsModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    teamName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    underscored: true,
    sequelize: db,
    timestamps: false,
    tableName: 'teams',
  },
);

export default TeamsModel;
