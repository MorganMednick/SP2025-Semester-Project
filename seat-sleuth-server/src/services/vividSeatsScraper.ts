import puppeteer from 'puppeteer';

export const scrapeVividSeats = async (
  eventName: string,
  eventDate: string,
): Promise<{ price: number; url: string } | null | Error> => {
  const startUrl = 'https://www.vividseats.com/search?searchTerm=' + eventName.replace(/\s+/g, '+');

  const [year, month, day] = eventDate.split('-');
  const convertedDate = `${parseInt(month)}-${parseInt(day)}-${year}`;

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

    console.log('Scraping Vivid Seats URL: ', startUrl);

    await page.goto(startUrl, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    const eventLinks = await page.$$eval('a.styles_linkContainer__4li3j', (elements) =>
    elements.map((el) => el.href).filter(Boolean),
    );
    for (const event of eventLinks) {
       
        if (event.includes(convertedDate)){
            await page.goto(event, { waitUntil: 'networkidle2' });
            const prices = await page
            .$$eval('.MuiTypography-body-bold', elements =>
            elements.map(el => el.textContent?.trim())
            .filter(text => text?.startsWith('$')));
            
            await browser.close();
            console.log('Found Vivid Seats event: ', event, " at price ", prices[0]);
            return { price: Number(prices[0]?.replace("$", "")), url: event };
        }
    }
    console.log('Vivid Seats location not found for this event ');
    await browser.close();
    return null;
  } catch (error) {
    console.error('Error scraping Vivid Seats: ', error);
    return error as Error;
  }
};
