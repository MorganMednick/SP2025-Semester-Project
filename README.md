# SP2025: Group 8 Seat Slueth

Name your repository using the following format:
**SP2025_Group_8**
(Example: SP2025_Group_9)

## Team Members

- Veda Bhalla: bhalla.v@wustl.edu ; bhalla-v
- Sammy Falvey: falvey.s@wustl.edu ; sammyfalvey
- Morgan Mednick: m.g.mednick@wustl.edu ; morganmednick
- Jayce Bordelon: b.jayce@wustl.edu ; Jayce Bordelon

## TA

Evan

## Objectives

&lt;Description of what your project is about, your key functionalities, tech stacks used, etc. &gt;

# **How to Run Seat Sleuth**

## **Project Overview**

Our application consists of four key components:

1. **React Client** – Frontend interface
2. **Node + Express Server** – Backend API
3. **PostgreSQL Database + Prisma ORM** – Data storage and management
4. **External API Dependencies** – Data sources

---

## **Docker Setup**

The application is fully containerized using **Docker Compose**, eliminating the need for manual configuration of the server or client. No local `.env` files are required since environment variables are handled within the compose file.

### **1. Install Docker**

1. Download and install **Docker Desktop** from [here](https://docs.docker.com/desktop/setup/install/mac-install/).
2. Start **Docker Desktop** and ensure the daemon is running.

### **2. Configure `.env` for Local Development**

For local development, you still need a `.env` file under `./seat-sleuth-server/.env`. Your `.env` should look like this:

```bash
# Database connection. Docker will overwrite the "localhost" with "database"
DATABASE_URL="postgresql://seat-sleuth-user:seat-sleuth-password-12345@localhost:5432/seat-sleuth"

# Environment settings
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
SESSION_SECRET="<32 char secure string>"
```

**Note:** The database URL uses `localhost`, not `database`. This is required for running Prisma migrations locally.

---

## **Running the Server Locally**

### **1. Apply Prisma Migrations**

Before running the application, apply database migrations:

```bash
npx prisma migrate deploy && npx prisma db push
```

If you encounter issues, reset the database:

```bash
npx prisma migrate reset --force
```

---

## **Fixing Prisma & Database Issues**

If Prisma is not recognizing your database schema, ensure your local database is set up correctly.

### **1. Restart PostgreSQL**

```bash
brew services restart postgresql
```

### **2. Connect to PostgreSQL**

```bash
psql -U <your-username> -h localhost -d postgres
```

### **3. Create the Database and User**

In the PostgreSQL shell, run:

```sql
-- Create the database
CREATE DATABASE "seat-sleuth";

-- Create the user
CREATE USER "seat-sleuth-user" WITH PASSWORD 'seat-sleuth-password-12345';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "seat-sleuth" TO "seat-sleuth-user";

-- Change ownership
ALTER DATABASE "seat-sleuth" OWNER TO "seat-sleuth-user";
ALTER SCHEMA public OWNER TO "seat-sleuth-user";
```

Ensure your `.env` file in `./seat-sleuth-server/.env` is correctly set up:

```bash
DATABASE_URL="postgresql://seat-sleuth-user:seat-sleuth-password-12345@localhost:5432/seat-sleuth"
```

Now apply the Prisma migrations:

```bash
npx prisma migrate reset --force
```

---

## **Running the Application with Docker**

1. Change the permissions of the start script:

   ```bash
   chmod +x ./start.sh
   ```

2. Run the script:
   ```bash
   ./start.sh
   ```

If everything is successful, you should see output similar to:

```bash
[+] Running 12/12
 ✔ client                               Built                                                                                                                         0.0s
 ✔ prisma-studio                        Built                                                                                                                         0.0s
 ✔ server                               Built                                                                                                                         0.0s
 ✔ Network seat-sleuth_default          Created                                                                                                                       0.3s
 ✔ Volume "seat-sleuth-server-modules"  Created                                                                                                                       0.0s
 ✔ Volume "seat-sleuth-postgres-data"   Created                                                                                                                       0.0s
 ✔ Volume "seat-sleuth-client-modules"  Created                                                                                                                       0.0s
 ✔ Container database                   Healthy                                                                                                                     24.4s
 ✔ Container server                     Healthy                                                                                                                     22.8s
 ✔ Container prisma-studio              Healthy                                                                                                                     22.8s
 ✔ Container client                     Healthy                                                                                                                     20.4s
 ✔ Container health                     Started                                                                                                                     18.5s

Health Check Complete! All Services Healthy...

Seat Sleuth is Up and Running!

        ✅ Client:        http://localhost:5173
        ✅ Server:        http://localhost:4000
        ✅ Prisma Studio: http://localhost:5555
```

At this point, the application should be fully operational.

## **Running the Node Tests**

1. In the root of the server, you need to create a `.env.test` file. The file contents should look like:

```bash
NODE_ENV=test
DATABASE_URL=postgresql://seat-sleuth-user:seat-sleuth-password@localhost:5433/seat-sleuth-test
SESSION_SECRET=test_secret
CLIENT_URL=http://localhost:5173
```

2. Run the tests with:

```bash
npm run test
```

3. You will see coverage of the tests, and the output should look similar to this:

```txt
All tests passed

-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |   78.34 |    74.19 |   69.56 |   78.41 |
 src                   |   52.63 |        0 |       0 |   58.82 |
  app.ts               |     100 |      100 |     100 |     100 |
  server.ts            |       0 |        0 |       0 |       0 | 2-12
 src/config            |      70 |       50 |     100 |      70 |
  db.ts                |      80 |      100 |     100 |      80 | 11-12
  env.ts               |      60 |       50 |     100 |      60 | 6,10,14,19
 src/controllers       |     100 |      100 |     100 |     100 |
  authController.ts    |     100 |      100 |     100 |     100 |
 src/data              |     100 |      100 |     100 |     100 |
  constants.ts         |     100 |      100 |     100 |     100 |
 src/middleware        |   76.47 |        0 |   85.71 |      75 |
  auth.ts              |     100 |      100 |     100 |     100 |
  gracefulShutdown.ts  |    90.9 |      100 |     100 |   88.88 | 14
  protectRoutes.ts     |       0 |        0 |       0 |       0 | 2-9
 src/routes            |     100 |      100 |     100 |     100 |
  authRoutes.ts        |     100 |      100 |     100 |     100 |
  index.ts             |     100 |      100 |     100 |     100 |
 src/tests             |       0 |      100 |       0 |       0 |
  globalSetup.ts       |       0 |      100 |       0 |       0 | 1-8
 src/types             |       0 |        0 |       0 |       0 |
  express-session.d.ts |       0 |        0 |       0 |       0 |
 src/types/shared/api  |       0 |      100 |       0 |       0 |
  api.ts               |       0 |      100 |       0 |       0 | 1-4
  apiSchema.ts         |       0 |      100 |     100 |       0 | 9
 src/util              |     100 |       90 |     100 |     100 |
  responseUtils.ts     |     100 |       90 |     100 |     100 | 26
-----------------------|---------|----------|---------|---------|-------------------

Test Suites: 3 passed, 3 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        3.47 s
Ran all test suites.
```

We want at least **50% test coverage** for the duration of the semester!
