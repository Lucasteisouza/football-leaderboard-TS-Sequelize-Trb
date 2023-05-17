import { Request, Response, NextFunction } from 'express';
import * as bcryptjs from 'bcryptjs';
import { verifyJWT } from '../auth/useJWT';
import UserModel from '../database/models/Users';

const INVALID_FIELDS = 'Invalid email or password';

const verifyPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  if (password.length < 6) {
    return res.status(401).json({ message: INVALID_FIELDS });
  }
  next();
};

const verifyEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(401).json({ message: INVALID_FIELDS });
  }
  next();
};

const verifyExistance = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const userFound = await UserModel.findOne({ where: { email } });
  if (!userFound) {
    return res.status(401).json({ message: INVALID_FIELDS });
  }
  const passwordMatch = bcryptjs.compareSync(password, userFound.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: INVALID_FIELDS });
  }
  next();
};

const hasValidToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }
  const decoded = verifyJWT(authorization);
  if (!decoded) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
  req.body.user = decoded;
  next();
};
export default { verifyEmail, verifyPassword, verifyExistance, hasValidToken };
