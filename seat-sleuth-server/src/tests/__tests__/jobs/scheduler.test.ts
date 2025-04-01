import { startScheduledTasks, stopScheduledTasks, tasks } from '../../../jobs/scheduler';

describe('Scheduled Task Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start all scheduled tasks', () => {
    const startSpies = Object.entries(tasks).map(([name, task]) => {
      const spy = jest.spyOn(task, 'start');
      return { name, spy };
    });

    startScheduledTasks();

    for (const { name, spy } of startSpies) {
      expect(spy).toHaveBeenCalled();
    }
  });

  it('should stop all scheduled tasks', () => {
    const stopSpies = Object.entries(tasks).map(([name, task]) => {
      const spy = jest.spyOn(task, 'stop');
      return { name, spy };
    });

    stopScheduledTasks();

    for (const { name, spy } of stopSpies) {
      expect(spy).toHaveBeenCalled();
    }
  });
});
