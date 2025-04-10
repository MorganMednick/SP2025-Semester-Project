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

1. run `npm run dev`
2. or run `docker-compose up --build`

## Linting!

Add the following to your settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.singleQuote": true,
  "prettier.trailingComma": "all",
  "prettier.printWidth": 100,
  "prettier.tabWidth": 2
}
```
