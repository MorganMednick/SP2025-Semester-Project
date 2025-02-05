import prisma from '../config/db';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { BCRYPT_SALT_ROUNDS } from '../data/constants';
import { User } from '@prisma/client';
import { AuthResponse } from '../types/shared/api/responses';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Missing email or password',
        error: null,
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      sendError(res, {
        statusCode: StatusCodes.CONFLICT,
        message: 'User with this email already exists',
        error: null,
      });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, BCRYPT_SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    console.info('Registered', userWithoutPassword);

    sendSuccess<AuthResponse>(res, {
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while creating the user',
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Missing email or password',
        error: null,
      });
      return;
    }

    const user: User | null = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: null,
      });
      return;
    }

    const isPasswordValid: boolean = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: null,
      });
      return;
    }

    req.session.userId = user.id;

    sendSuccess<AuthResponse>(res, {
      statusCode: StatusCodes.OK,
      message: 'Login successful',
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred during login',
      error,
    });
  }
};

export const checkLogin = async (req: Request, res: Response): Promise<void> => {
  if (req.session.userId) {
    sendSuccess<AuthResponse>(res, {
      statusCode: StatusCodes.OK,
      message: 'User is logged in',
    });
    return;
  }

  sendError(res, {
    statusCode: StatusCodes.UNAUTHORIZED,
    message: 'User not logged in',
    error: null,
  });
};
