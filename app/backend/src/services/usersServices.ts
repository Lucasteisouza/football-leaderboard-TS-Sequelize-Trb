import UserModel, { UserAttributes } from '../database/models/Users';
import { createJWT } from '../auth/useJWT';

const USER_NOT_FOUND = 'User not found';
class UsersServices {
  public static async login(email: string):Promise< string | null> {
    const loggedUser = await UserModel.findAll({ where: { email } });
    if (!loggedUser) throw new Error(USER_NOT_FOUND);
    return createJWT(email);
  }

  public static async getAllUsers():Promise<UserAttributes[]> {
    const users = await UserModel.findAll();
    return users.map((user) => user.toJSON());
  }

  public static async getUserById(id: number):Promise<UserAttributes | null> {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error(USER_NOT_FOUND);
    return user.toJSON();
  }

  public static async getUserRole(email: string):Promise<string> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error(USER_NOT_FOUND);
    return user.role;
  }
}

export default UsersServices;
