import { sanitizeEventName } from '../emailUtils';

export const priceUpdateTemplate = (
  eventName: string,
  ticketPrice: string,
  startTime: string,
): string => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #1E1E1E;
          padding: 20px;
          color: #FFFFFF;
        }
        .container {
          max-width: 600px;
          background: #2A2A2A;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
          text-align: center;
          margin: auto;
        }
        .header {
          background-color: #4c9662;
          padding: 15px;
          font-size: 22px;
          font-weight: bold;
          color: #FFFFFF;
          border-radius: 8px 8px 0 0;
        }
        .price {
          font-size: 28px;
          color: #FFD700;
          font-weight: bold;
        }
        .content {
          padding: 20px;
        }
        .button {
          background-color: #4c9662;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
          margin-top: 15px;
          font-size: 16px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #999999;
        }
        .highlight {
          font-weight: bold;
          color: #FFD700;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Price Update from <span class="highlight">Seat Sleuth</span></div>
        <div class="content">
          <p>Great news! The ticket price for <strong>${eventName}</strong> has lowered!</p>
          <p class="price">It is now listed at $${ticketPrice}</p>
          <p>Event Date: ${startTime || 'Unknown'}</p>
          <p>Act fast before prices go up again!</p>
          <a href="http://localhost:5173/events/${sanitizeEventName(eventName)}/" class="button">View Tickets</a>
        </div>
        <div class="footer">
          <p>Sent with ❤️ from <span class="highlight">Seat Sleuth</span></p>
          <p>&copy; 2025 Seat Sleuth, Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;
};
