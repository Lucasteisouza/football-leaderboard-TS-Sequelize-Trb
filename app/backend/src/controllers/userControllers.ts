import { Request, Response } from 'express';
import UsersServices from '../services/usersServices';

class UsersController {
  public static async login(req: Request, res: Response) {
    const { email } = req.body;
    const token = await UsersServices.login(email);
    res.status(200).json({ token });
  }

  public static async getAllUsers(_req: Request, res: Response) {
    const users = await UsersServices.getAllUsers();
    res.status(200).json(users);
  }

  public static async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UsersServices.getUserById(Number(id));
    res.status(200).json(user);
  }

  public static async getUserRole(req: Request, res: Response) {
    const { user } = req.body;
    const { email } = user;
    const role = await UsersServices.getUserRole(email);
    return res.status(200).json({ role });
  }
}

export default UsersController;
