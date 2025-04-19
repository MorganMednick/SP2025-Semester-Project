/* eslint @typescript-eslint/no-explicit-any: 0 */
import puppeteer from 'puppeteer';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ScrapingPricePayload } from '../types/shared/payloads';
import { ScrapingPriceResponse } from '../types/shared/responses';
import { formatDateToScrape, shortenEventName } from '../util/scrapeUtil';

export const scrapeVividSeats = async ({
  eventName,
  eventDate,
}: ScrapingPricePayload): Promise<ScrapingPriceResponse | null | Error> => {
  const convertedDate = formatDateToScrape(eventDate);
  const shortenedName = shortenEventName(eventName);

  const startUrl =
    'https://www.vividseats.com/search?searchTerm=' + shortenedName.replace(/\s+/g, '+');

  let browser;
  try {
    // puppeteer.use(StealthPlugin());

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--ignore-certificate-errors',
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    console.log('Scraping Vivid Seats URL: ', startUrl);

    await page.goto(startUrl, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    await page.waitForSelector('[data-testid^="production-listing"]').catch((error: Error) => {
      console.log('Vivid Seats event not found ');
      return error;
    });

    // eslint-disable @typescript-eslint/no-explicit-any

    const eventLinks = await page.$$eval(
      '[data-testid^="production-listing"] a',
      (elements: any[]) => elements.map((el: { href: any }) => el.href).filter(Boolean),
    );
    for (const event of eventLinks) {
      if (event.includes(convertedDate)) {
        await page.goto(event, { waitUntil: 'networkidle2' });
        await Promise.all([
          page.waitForSelector('[data-testid^="listing-price"]'),
          page.waitForFunction(() => document.readyState === 'complete'),
        ]).catch((error) => {
          console.log('Vivid Seats price not found on page', event);
          return error as Error;
        });

        const prices = await page.$$eval('[data-testid="listing-price"]', (elements: any[]) =>
          elements
            .map((el: { textContent: string }) => el.textContent?.trim())
            .filter((text: string) => text?.startsWith('$')),
        );
        await browser.close();
        console.log('Found Vivid Seats event: ', event, ' at price ', prices[0]);
        return { price: Number(prices[0]?.replace('$', '')), url: event };
      }
    }
    console.log('Vivid Seats location not found for this event ');
    await browser.close();
    return null;
  } catch (error) {
    console.error('Error scraping Vivid Seats: ', error);
    return error as Error;
  } finally {
    if (browser) await browser.close();
  }
};
