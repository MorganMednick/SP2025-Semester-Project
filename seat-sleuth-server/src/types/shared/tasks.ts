export type TaskName = 'WATCHLIST_EMAIL' | 'PRICE_UPDATE';
export interface Task {
  start: () => void;
  stop: () => void;
}

export const CronMap: Record<string, string> = {
  EVERY_MINUTE: '* * * * *',
  EVERY_5_MINUTES: '*/5 * * * *',
  EVERY_10_MINUTES: '*/10 * * * *',
  EVERY_30_MINUTES: '*/30 * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_DAY_MIDNIGHT: '0 0 * * *',
  EVERY_DAY_8AM: '0 8 * * *',
  EVERY_MONDAY_9AM: '0 9 * * 1',
  EVERY_SUNDAY_MIDNIGHT: '0 0 * * 0',
  EVERY_WEEKDAY_5PM: '0 17 * * 1-5',
};
