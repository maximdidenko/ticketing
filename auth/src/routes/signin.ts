import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@md-tickets/common';
import { User } from '../models/user';
import { BadRequestError } from '@md-tickets/common';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

const validationRules = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password'),
];

router.post('/api/users/signin', validationRules, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);

  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials');
  }

  // Genarate JWT
  const userJWT = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email
    },
    process.env.JWT_KEY!
  );

  // Store it on session object
  req.session = { 
    jwt: userJWT 
  };

  res.status(200).send(existingUser);
});

export { router as signinRouter };