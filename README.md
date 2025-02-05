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

## How to Run

### Anatomy

Our application has four moving parts:

1. React Client
2. Node + Express Server
3. Psql Database + Prisma ORM Layer
4. External API Data Dependencies

## Docker

We have now containerized the entire application with a single docker-compose.yml. This means that you will no longer need specified configurations for your server or client (No more .env necessary because it is in the compose).

1. Install Docker Desktop [Here](https://docs.docker.com/desktop/setup/install/mac-install/)
2. Start the Docker Desktop. If the Daemon is running (pretty much as long as the app opens), you should be all good to proceed.

### Running the application with docker

1. Configure `.env` under `./seat-sleuth-server/.env`. This is because your local environment will be different than the stood up postgresql volume. Your `.env` should look like

```bash
DATABASE_URL="postgresql://seat-sleuth-user:seat-sleuth-password-12345@localhost:5432/seat-sleuth"
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
SESSION_SECRET="<32 char secure string>"

```

**Note that** the database ul points to loclhost instead of database. This is because you will need manual database migrations if you want to run testing and or change code.

2. Change the permissions of the start script:

```bash
chmod +x ./start.sh
```

3. Run the script:

```bash
./start.sh
```

You should see something like

```bash
[+] Running 12/12
 ✔ client                               Built                                                                                                                                             0.0s
 ✔ prisma-studio                        Built                                                                                                                                             0.0s
 ✔ server                               Built                                                                                                                                             0.0s
 ✔ Network seat-sleuth_default          Created                                                                                                                                           0.3s
 ✔ Volume "seat-sleuth-server-modules"  Created                                                                                                                                           0.0s
 ✔ Volume "seat-sleuth-postgres-data"   Created                                                                                                                                           0.0s
 ✔ Volume "seat-sleuth-client-modules"  Created                                                                                                                                           0.0s
 ✔ Container database                   Healthy                                                                                                                                          24.4s
 ✔ Container server                     Healthy                                                                                                                                          22.8s
 ✔ Container prisma-studio              Healthy                                                                                                                                          22.8s
 ✔ Container client                     Healthy                                                                                                                                          20.4s
 ✔ Container health                     Started                                                                                                                                          18.5s

🔥 Health Check Complete! All Services Healthy...

🗑️  Removing Vestigial Health Check container for memory optimization (ID: 9c631dcec8f9)...

🚀 Seat Sleuth is Up and Running! 🦥

        ✅ Client:        http://localhost:5173
        ✅ Server:        http://localhost:4000
        ✅ Prisma Studio: http://localhost:5555

```

### Running server tests

TODO
