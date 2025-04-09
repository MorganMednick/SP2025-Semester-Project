import OpenAI from 'openai';
import { GPT_API_KEY, GPT_MAX_RESPONSE_SIZE } from '../config/env';
import { PriceOption } from '../types/shared/responses';
import { INITIAL_GPT_PROMPT } from '../data/constants';

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

const conversationHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
  {
    role: 'system',
    content: INITIAL_GPT_PROMPT,
  },
];

export async function getTicketPrices(
  eventName: string,
  location: string,
  dateTime: string,
): Promise<PriceOption[] | string | null> {
  try {
    const userPrompt = `${eventName} | ${location} | ${dateTime}`;

    conversationHistory.push({
      role: 'user',
      content: userPrompt,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: conversationHistory,
      max_tokens: Number(GPT_MAX_RESPONSE_SIZE),
    });

    const responseText = response.choices[0].message.content;

    conversationHistory.push({
      role: 'assistant',
      content: responseText ?? '',
    });

    console.log('Ticket prices response:', responseText);
    return responseText;
  } catch (error) {
    console.error('Error retrieving ticket prices:', error);
    throw error;
  }
}
