import prisma from '../config/db';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../util/responseUtils';
import { AuthRequest, AuthSchema } from '../types/requests/authRequests';
import { BCRYPT_SALT_ROUNDS } from '../data/constants';
import { generateToken } from '../util/jwtUtils';

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = AuthSchema.safeParse(req.body as AuthRequest);

    if (!parsed.success) {
      return sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid request data',
        error: parsed.error.format(),
      });
    }

    const { email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return sendError(res, {
        statusCode: StatusCodes.CONFLICT,
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcryptjs.hash(password, BCRYPT_SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return sendSuccess(res, {
      statusCode: StatusCodes.CREATED,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    return sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while creating the user',
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const parsed = AuthSchema.safeParse(req.body as AuthRequest);

    if (!parsed.success) {
      return sendError(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid request data',
        error: parsed.error.format(),
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user.id);

    return sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Login successful',
      data: { token },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred during login',
      error,
    });
  }
};
