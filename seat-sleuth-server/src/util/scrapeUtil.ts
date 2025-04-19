export function formatDateToScrape(date: Date): string {
  const utcDate = new Date(date);

  const year = utcDate.getFullYear();
  const month = utcDate.getMonth() + 1; // 0-based
  const day = utcDate.getDate();

  return `${month}-${day}-${year}`;
}

export function shortenEventName(eventName: string): string {
  const cleanedName = eventName
    .split(':')[0]
    .split('-')[0]
    .split("'")[0]
    .split('/')[0]
    .replace(/[^\w\s]/g, '');
  const shortenedName = cleanedName.trim().split(/\s+/).slice(0, 3).join(' ');
  return shortenedName;
}
