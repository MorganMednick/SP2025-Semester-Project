describe('Environment Variables Validation', () => {
  const OLD_ENV = process.env; // Store original environment variables

  beforeEach(() => {
    jest.resetModules(); // Reset modules to force fresh import
    process.env = { ...OLD_ENV }; // Reset environment variables before each test
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore original env variables after all tests
  });

  /** ===============================
   *  SUCCESS TESTS
   *  =============================== */

  it('[ENV SUCCESS] should load environment variables successfully from .env.test', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.CLIENT_URL).toBeDefined();
    expect(process.env.SESSION_SECRET).toBeDefined();
    expect(process.env.NODE_ENV).toBe('test');

    expect(() => require('../../../config/env')).not.toThrow();
  });

  /** ===============================
   *  FAILURE TESTS - MISSING VARIABLES
   *  =============================== */

  it('[ENV FAILURE] should throw an error if DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;

    expect(() => require('../../../config/env')).toThrow(
      '\n\nDATABASE_URL is not defined in your environment variables.\n\n',
    );
  });

  it('[ENV FAILURE] should throw an error if CLIENT_URL is missing', () => {
    delete process.env.CLIENT_URL;

    expect(() => require('../../../config/env')).toThrow(
      '\n\nCLIENT_URL must be set in your .env to run this application. \n\n\n',
    );
  });

  it('[ENV FAILURE] should throw an error if SESSION_SECRET is missing', () => {
    delete process.env.SESSION_SECRET;

    expect(() => require('../../../config/env')).toThrow(
      '\n\nSESSION_SECRET must be set in your .env to run this application. \n\n\n',
    );
  });

  it('[ENV FAILURE] should throw an error if NODE_ENV is missing', () => {
    delete process.env.NODE_ENV;

    try {
      require('../../../config/env');
    } catch (err: any) {
      expect(err.message.trim()).toContain(
        'NODE_ENV must be set in your .env to run this application.',
      );
    }
  });

  it('[ENV FAILURE] should throw an error if NODE_ENV is invalid', () => {
    process.env.NODE_ENV = 'invalid_env';

    try {
      require('../../../config/env');
    } catch (err: any) {
      expect(err.message.trim()).toContain(
        'NODE_ENV must be set in your .env to run this application.',
      );
    }
  });
});
