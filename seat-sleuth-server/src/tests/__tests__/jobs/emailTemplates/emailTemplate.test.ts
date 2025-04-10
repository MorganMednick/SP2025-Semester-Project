import { getHtmlBodyForWatchlistPriceUpdate } from '../../../../jobs/emailTemplates/emailTemplate';
import { sanitizeEventName } from '../../../../util/emailUtils';

jest.mock('../../../../util/emailUtils', () => ({
  sanitizeEventName: jest.fn(() => 'sanitized-name'),
}));

describe('getHtmlBodyForWatchlistPriceUpdate', () => {
  const mockEventName = 'Taylor Swift Live';
  const mockPrice = '129.99';
  const mockStartTime = 'April 10, 2025';

  it('includes event name, price, and start time in the HTML output', () => {
    const html = getHtmlBodyForWatchlistPriceUpdate(mockEventName, mockPrice, mockStartTime);

    expect(html).toContain(mockEventName);
    expect(html).toContain(`$${mockPrice}`);
    expect(html).toContain(mockStartTime);
  });

  it('uses sanitizeEventName in the event URL', () => {
    getHtmlBodyForWatchlistPriceUpdate(mockEventName, mockPrice, mockStartTime);
    expect(sanitizeEventName).toHaveBeenCalledWith(mockEventName);
  });

  it('outputs a valid URL with the sanitized event name', () => {
    const html = getHtmlBodyForWatchlistPriceUpdate(mockEventName, mockPrice, mockStartTime);
    expect(html).toContain('http://localhost:5173/events/sanitized-name/');
  });

  it('gracefully handles missing start time', () => {
    const html = getHtmlBodyForWatchlistPriceUpdate(mockEventName, mockPrice, '');
    expect(html).toContain('Event Date: Unknown');
  });

  it('matches snapshot', () => {
    const html = getHtmlBodyForWatchlistPriceUpdate(mockEventName, mockPrice, mockStartTime);
    expect(html).toMatchSnapshot();
  });
});
