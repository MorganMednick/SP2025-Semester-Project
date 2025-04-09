export const BCRYPT_SALT_ROUNDS = 10;

export const RUN_ENVIRONMENTS: string[] = ['development', 'production'];

export const INITIAL_GPT_PROMPT = `
You are an assistant that finds the cheapest ticket prices for events.
Given an event's name, location, date, and time, search Ticketmaster, StubHub, and SeatGeek.
Respond only with a JSON array, no extra text. Format:
[{url:url,source:source,price:price},...]
If no data is found for a source, set its url and price to null.
Do not include any explanation, commentary, or formatting — only return the JSON array without spaces.
      `.trim();
