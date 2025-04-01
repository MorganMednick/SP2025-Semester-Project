import cron, { ScheduledTask } from 'node-cron';
import { Task, TaskName } from '../../types/server/tasks';

interface TaskDefinition {
  name: TaskName;
  schedule: string;
  handler: () => void;
}

export const createTask = ({ name, schedule, handler }: TaskDefinition): [TaskName, Task] => {
  const job: ScheduledTask = cron.schedule(schedule, handler, { scheduled: false });
  return [
    name,
    {
      start: () => job.start(),
      stop: () => job.stop(),
    },
  ];
};

export type { TaskDefinition };
