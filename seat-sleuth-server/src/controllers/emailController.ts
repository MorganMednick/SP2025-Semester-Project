import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import emailjs from 'emailjs-com';

const EMAILJS_SERVICE_ID = 'service_sp8n7qp';
const EMAILJS_TEMPLATE_ID = 'template_qvruunm';
const EMAILJS_PUBLIC_KEY = 'Rtgeb1XsdfLK3ymzW';

export const sendPriceDropEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = req.params.userEmail;
    const ticketName = req.params.ticket_name;
    const ticketPrice = req.params.ticket_price;
    console.log('poop'); //TODO delete

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        email: userEmail,
        ticket_name: ticketName,
        ticket_price: ticketPrice,
      },
      EMAILJS_PUBLIC_KEY,
    );

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Email sent successfully!',
      data: response,
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
