import * as jwt from 'jsonwebtoken';

const secret: string = process.env.JWT_SECRET || 'secret';

export const createJWT = (email: string) => {
  const jwtConfig: jwt.SignOptions = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  const token: string = jwt.sign({ email }, secret, jwtConfig);

  return token;
};

export const verifyJWT = (token: string) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};
