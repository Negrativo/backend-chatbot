// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const verifyAsync = promisify(jwt.verify);

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "No token provided" });
  }

  const [scheme, token] = authHeader.split(" ");
  
  if (!token || scheme !== 'Bearer') {
    return res.status(401).send({ error: "Token format invalid" });
  }

  try {
    const decoded = await verifyAsync(token, jwtSecret);
    console.log(decoded)
    req.adminId = decoded.adminId;

    return next();
  } catch (err) {
    return res.status(401).send({ error: "Token invalid" });
  }
};
