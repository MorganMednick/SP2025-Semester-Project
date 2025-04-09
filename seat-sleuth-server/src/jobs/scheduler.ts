import { createTask, TaskDefinition } from './tasks/taskFactory';
import { CronMap, Task, TaskName } from '../types/shared/tasks';
import { sendwatchlistUpdateEmail } from './tasks/emailTasks';
import { WATCHLIST_EMAIL_CRON } from '../config/env';
const taskDefinitions: TaskDefinition[] = [
  {
    name: 'WATCHLIST_EMAIL',
    schedule: WATCHLIST_EMAIL_CRON || CronMap.EVERY_DAY_8AM, // Defaults to 8AM every day
    handler: sendwatchlistUpdateEmail,
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
