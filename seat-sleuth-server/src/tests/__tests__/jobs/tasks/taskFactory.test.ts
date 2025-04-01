import cron from 'node-cron';
import { TaskDefinition, createTask } from '../../../../jobs/tasks/taskFactory';
import { TaskName } from '../../../../types/server/tasks';

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

describe('createTask', () => {
  const mockStart = jest.fn();
  const mockStop = jest.fn();
  const mockJob = { start: mockStart, stop: mockStop } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    (cron.schedule as jest.Mock).mockReturnValue(mockJob);
  });

  const taskDef: TaskDefinition = {
    name: 'WATCHLIST_EMAIL' as TaskName,
    schedule: '0 8 * * *',
    handler: jest.fn(),
  };

  it('calls cron.schedule with correct arguments', () => {
    createTask(taskDef);

    expect(cron.schedule).toHaveBeenCalledWith(taskDef.schedule, taskDef.handler, {
      scheduled: false,
    });
  });

  it('returns a task with start and stop methods that call the cron job', () => {
    const [name, task] = createTask(taskDef);

    expect(name).toBe('WATCHLIST_EMAIL');

    task.start();
    expect(mockStart).toHaveBeenCalled();

    task.stop();
    expect(mockStop).toHaveBeenCalled();
  });
});
