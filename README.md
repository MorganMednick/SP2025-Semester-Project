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

### Running PSQL Locally on MacOS

If you do not already have it installed, install postgres14 with:

```
brew install postgresql@14
```

Then start it locally:

```
brew services start postgresql@14
```

Then, to enter the psql shell, run:

```
psql postgres
```

Next, Create your user. This will be the user that connects via prisma auth client to your psql database:

```sql
CREATE USER <your-user-name> WITH PASSWORD '<your_password>';
-- To quit the shell, then run:
\q
```

Now, in the `./seat-sleuth-server` directory, create a file named `.env`. In the file, add the following line:

```
DATABASE_URL="postgresql://<your-user-name>:<your_password>@localhost:5432/seat-sleuth?schema=public"
```

**Important**: Make sure you change the username and password of the `DATABASE_URL` to be the username and password you just made for psql

Make sure yoyour terminal is currently in the base directory of the server (seat-sleuth-server). If you arent, cd into it.

Now, if permissions allow, you should be able to generate the database with

```bash
npx prisma migrate dev --name init
```

And to synch the migration with your local database:

```bash
npx prisma db push
```

Finally, you will need to update your `.env` to include a secure [jwt token](https://jwt.io/introduction). You can generate a good enough one by using openssl:

```bash
openssl rand -base64 64
```

Copy the output of the above command onto your clipboard and add the following to your `.env`:

```bash
JWT_SECRET="<output-of-previous-command>"
```

You should now be good to go! To test this, let's try running the server (I already have a connecticity script in place) :

```bash
npm i && npm run dev
```

If all is good, you should see something like this:

```bash
Jayces-MBP:seat-sleuth-server jaycebordelon$ npm i && npm run dev

up to date, audited 155 packages in 375ms

19 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

> seat-sleuth-server@1.0.0 dev
> nodemon src/server.ts

[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/server.ts`
Server is running on Port: 4000
Prisma client synched with postgresql://jaycebordelon:1234@localhost:5432/seat-sleuth?schema=public
```

### Running the server

Now that your database is all migrated and set up, all you will need to do to run the server is start postgresql if it is stopped:

```bash
# resart in case it was started
brew services restart postgresql
```

Then, cd into `./seat-sleuth-server` and run

```
npm i && npm run dev
```

I currently have included a few test scripts that will try and mock auth requests. Please note that the results are dependent on your local db data store. To run them, first change permissions of the `./seat-sleuth-server/script` folder:

```bash
chmod -R +x ./scripts
```

Then, you can run all test files with

```bash
./scripts/run-manual-tests.sh
```

**_This is likely a temporary testing feature if we get some solid testing framework set up_**

### Running the client

**_IN A SEPERATE TERMINAL SHELL_** you will have to cd into the root of the client (react project) at `./seat-sleuth-client`.

Then run

```bash
npm i
# Followed by
npm run dev
```

Finally, ensure you can load the application at http://localhost:5173/. Your terminal should look like this.

```bash
Jayces-MBP:seat-sleuth-client jaycebordelon$ npm i

up to date, audited 144 packages in 365ms

40 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Jayces-MBP:seat-sleuth-client jaycebordelon$ npm run dev

> seat-sleuth-client@0.0.0 dev
> vite


  VITE v6.0.11  ready in 554 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Server is now running on port 4000 and our client will be on port 5173. Keep this in mind~!!!!!
