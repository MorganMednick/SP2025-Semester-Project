import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import emailjs from 'emailjs-com';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY!;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY!;

export const sendPriceDropEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = req.params.userEmail;
    const ticketName = req.params.ticket_name;
    const ticketPrice = req.params.ticket_price;
    console.log('sendPriceDropEmail call'); //TODO delete

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        email: userEmail,
        ticket_name: ticketName,
        ticket_price: ticketPrice,
      },
      EMAILJS_PUBLIC_KEY,
      EMAILJS_PRIVATE_KEY,
    );

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Email sent successfully!',
    });
  } catch (error) {
    console.error('Email Send Error:', error);

    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to send email.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
