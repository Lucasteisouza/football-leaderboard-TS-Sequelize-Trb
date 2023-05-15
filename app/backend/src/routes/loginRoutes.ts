import { Router } from 'express';
import UserControllers from '../controllers/userControllers';
import loginInfo from '../middlewares/loginInfo';

const router = Router();

router.post(
  '/',
  loginInfo.verifyEmail,
  loginInfo.verifyPassword,
  loginInfo.verifyExistance,
  UserControllers.login,
);

router.get(
  '/role',
  loginInfo.hasValidToken,
  UserControllers.getUserRole,
);

export default router;
