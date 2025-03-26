import prisma from '../config/db';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { BCRYPT_SALT_ROUNDS } from '../data/constants';
import { User } from '@prisma/client';
import { AuthResponse } from '../types/shared/api/responses';
import { destroySessionAndClearCookies } from '../util/sessionUtils';

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

    req.session.userId = newUser.id;

    sendSuccess<AuthResponse>(res, {
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
      data: { userId: newUser.id },
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
      data: { userId: user.id },
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
  sendSuccess<AuthResponse>(res, {
    statusCode: StatusCodes.OK,
    message: 'User is logged in',
  });
  return;
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.session.userId) {
    sendError(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'User not logged in',
      error: null,
    });
    return;
  }

  destroySessionAndClearCookies(req, res);
};
