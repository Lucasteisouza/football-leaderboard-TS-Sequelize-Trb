import { DataTypes, Model } from 'sequelize';
import db from '.';

export interface UserAttributes {
  id: number;
  username: string;
  role: string;
  password: string;
  email: string;
}

export type UserCreationAttributes = Omit<UserAttributes, 'id'>;

class UsersModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare role: string;
  declare password: string;
  declare email: string;
}

UsersModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    underscored: true,
    sequelize: db,
    timestamps: false,
    tableName: 'users',
  },
);

export default UsersModel;
