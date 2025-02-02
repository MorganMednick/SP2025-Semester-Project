import prisma from '../config/db';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { BCRYPT_SALT_ROUNDS } from '../data/constants';
import { generateToken } from '../util/jwtUtils';
import { generateCookieForResponseToClient } from '../middleware/cookie';
import { User } from '@prisma/client';
import { RegistrationResponse } from '../types/shared/api/responses';

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      sendError(res, {
        statusCode: StatusCodes.CONFLICT,
        message: 'User with this email already exists',
        error: null
      });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, BCRYPT_SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    const { password: _, ...userWithoutPassword } = newUser;

    console.info('Registered', userWithoutPassword);

    sendSuccess(res, {
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
      data: {
        type: 'UserWithoutPassword',
        payload: userWithoutPassword as RegistrationResponse
      }
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while creating the user',
      error
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user: User | null = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: null
      });
      return;
    }

    const isPasswordValid: boolean = await bcryptjs.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: null
      });
      return;
    }

    const token: string = generateToken(user.id);

    generateCookieForResponseToClient(res, token);

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Login successful',
      data: {
        type: 'AuthToken',
        payload: { token }
      }
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred during login',
      error
    });
  }
};
