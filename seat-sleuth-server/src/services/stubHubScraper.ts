import puppeteer from 'puppeteer';
import { ScrapingPriceResponse } from '../types/shared/responses';
import { ScrapingPricePayload } from '../types/shared/payloads';
import { formatDateToScrape, shortenEventName } from '../util/scrapeUtil';

export const scrapeStubHub = async ({
  eventName,
  eventDate,
}: ScrapingPricePayload): Promise<ScrapingPriceResponse | null | Error> => {
  
  const convertedDate = formatDateToScrape(eventDate);
  const shortenedName = shortenEventName(eventName);


  const startUrl = 'https://www.stubhub.com/secure/Search?q=' + shortenedName.replace(/\s+/g, '+');

  try {
    const browser = await puppeteer.launch({
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

    console.log('Scraping StubHub URL: ', startUrl);

    await page.goto(startUrl, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    const eventLinks = await page.$$eval('a', (elements) =>
      elements.map((el) => el.href).filter(Boolean),
    );
    for (const event of eventLinks) {
      if (event.includes(convertedDate)) {
        await page.goto(event, { waitUntil: 'networkidle2' });
        const price = await page
          .$eval('.dNJQoP', (el) => el.textContent?.trim())
          .catch(() => undefined);
        await browser.close();
        console.log('Found StubHub event: ', event);
        return { price: Number(price?.replace('$', '')), url: event };
      }
    }
    console.log('StubHub location not found for this event ');

    await browser.close();
    return null;
  } catch (error) {
    console.error('Error scraping StubHub: ', error);
    return error as Error;
  }
};
