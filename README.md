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

1. Change the permissions of the docker install script:

```bash
chmod +x ./run-scripts/docker-install.sh
```

2. Run the docker install script:

```bash
./run-scripts/docker-install.sh
```

3. Change the permissions of the start script:

```bash
chmod +x ./start.sh
```

1. Run the script:

```bash
./start.sh
```

# You are done!
