import { createTask, TaskDefinition } from './tasks/taskFactory';
import { CronMap, Task, TaskName } from '../types/shared/tasks';
import { sendwatchlistUpdateEmail } from './tasks/emailTasks';
import { PRICE_UPDATE_CRON, WATCHLIST_EMAIL_CRON } from '../config/env';
import { updatePricesForPersistedEvents } from './tasks/priceUpdateTasks';
const taskDefinitions: TaskDefinition[] = [
  {
    name: 'WATCHLIST_EMAIL',
    schedule: WATCHLIST_EMAIL_CRON || CronMap.EVERY_DAY_8AM, // Defaults to 8AM every day
    handler: sendwatchlistUpdateEmail,
  },
  {
    name: 'PRICE_UPDATE',
    schedule: PRICE_UPDATE_CRON || CronMap.EVERY_5_MINUTES, // Defaults to every 5 mins
    handler: updatePricesForPersistedEvents,
  },
];

export const tasks = Object.fromEntries(taskDefinitions.map(createTask)) as Record<TaskName, Task>;

export const startScheduledTasks = (): void => {
  console.info('[SCHEDULER] Kicking off scheduled tasks...');
  Object.entries(tasks).forEach(([taskName, task]) => {
    console.info(`[SCHEDULER] Starting ${taskName}...`);
    task.start();
  });
  console.info('[SCHEDULER] Completed all scheduled tasks...');
};

export const stopScheduledTasks = (): void => {
  console.info('[SCHEDULER] Stopping all scheduled tasks...');
  Object.entries(tasks).forEach(([taskName, task]) => {
    console.info(`[SCHEDULER] Stopping ${taskName}...`);
    task.stop();
  });
};
