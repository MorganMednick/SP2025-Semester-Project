import { StatusCodes } from 'http-status-codes';
import { sendError, sendSuccess } from '../util/responseUtils';
import { Request, Response } from 'express';
import { SendPriceDropEmailParams } from '../types/shared/api/external/email';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY!;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY!;

export const sendPriceDropEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userEmail, ticket_name, ticket_price }: SendPriceDropEmailParams = req.body;

    const data = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        email: userEmail,
        ticket_name,
        ticket_price,
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `EmailJS API responded with status ${response.status}: ${JSON.stringify(errorData)}`,
      );
    }

    sendSuccess(res, {
      statusCode: StatusCodes.OK,
      message: 'Email sent successfully!',
    });
  } catch (error) {
    sendError(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Failed to send email.',
      error: error,
    });
  }
};
