import { DataTypes, Model } from 'sequelize';
import db from '.';
import TeamsModel from './Teams';

export interface MatchesAttributes {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export type MatchesCreationAttributes = Omit<MatchesAttributes, 'id'>;

class MatchesModel extends
  Model<MatchesAttributes, MatchesCreationAttributes> implements MatchesAttributes {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchesModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    homeTeamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: TeamsModel,
        key: 'id',
      },
    },
    homeTeamGoals: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    awayTeamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: TeamsModel,
        key: 'id',
      },
    },
    awayTeamGoals: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    inProgress: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
  },
  {
    underscored: true,
    sequelize: db,
    timestamps: false,
    tableName: 'teams',
  },
);

MatchesModel.belongsTo(TeamsModel, { foreignKey: 'homeTeamId', as: 'homeTeam' });
MatchesModel.belongsTo(TeamsModel, { foreignKey: 'awayTeamId', as: 'awayTeam' });
TeamsModel.hasMany(MatchesModel, { foreignKey: 'homeTeamId', as: 'homeTeam' });
TeamsModel.hasMany(MatchesModel, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default MatchesModel;
