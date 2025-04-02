import puppeteer from 'puppeteer';
import { StubHubScrapeResponse } from '../types/shared/api/responses';

export const scrapeStubHub = async (startUrl: string, targetLocation: string): Promise<StubHubScrapeResponse | null | Error> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process', '--ignore-certificate-errors'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    console.log("Scraping StubHub URL: ", startUrl);

    await page.goto(startUrl, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    const performerLinks = await page.$$eval('a.sc-2274f71f-2', (links) => 
      links.map((link) => link.href)
    );

    if (performerLinks.length > 0) {    
      await page.goto(performerLinks[0], { waitUntil: 'networkidle2' });
      const eventLinks = await page.$$eval('li.edUySU a', (elements) =>
        elements.map((el) => el.href).filter(Boolean)
      );
      for (const event of eventLinks){
        if(event.includes(targetLocation.toLowerCase())){
            await page.goto(event, { waitUntil: 'networkidle2' });
            const price = await page.$eval('.iwVOyT', (el) =>
              el.textContent?.trim()
            ).catch(() => undefined);
            await browser.close();
            console.log("Found StubHub event: ", event)
            return { price: Number(price?.replace("$", "")) , url: event};
        }
      }
      console.log("StubHub location not found for this event ")   
    } 
    else{
      console.log("StubHub event not found ");
    }   

    await browser.close();
    return null;
  } 
  catch (error) {
    throw new Error('Failed to fetch events');
  }
};
