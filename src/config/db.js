import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client.ts";

/*
    An adapter is a piece of code that acts as a translator between my application, and a specific type of database.
    Databases (PostgreSQL, mongoDB, MySQL etc) speak different languages e.g different network protocols,
    connection setups, SQL queries etc, so if I were to talk to each database directly, I would have to rewrite
    my code to support that database. That's why database adapters are important because they help bridge that
    gap of translating code from my ORM into syntax the specific database understands, allowing me switch between
    databases easily without breaking my application.

    An adapter is not to be confused with an ORM because ORM's work by using adapters underneath. When I write
    my application code, the ORM translates that code into SQL queries. After doing this, it sends the SQL query to the database
    via the database adapter specified. This is why I can change databases without changing my ORM code because the ORM abstracts
    away the SQL dialect differences, and the adapter abstracts away the database protocol differences
    
    Reference(s)
    1. Adapters — https://claude.ai/chat/dcbc7626-503b-4d0d-91e6-4838c354924c
    2. Difference btw adapters and ORMs - https://claude.ai/chat/2f3ad932-99d3-4849-8ab7-fa40b1d84177

*/
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

/*
    Add a configuration to avoid breaking the entire app when an issue occurs with
    the database. With the log property, I can specify what kind of logs I want to see,
    depending on the environment I am currently on (Dev or Prod).

    It is here I also pass the adapter I configured to the Prisma Client
*/
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  adapter,
});

// Note that connecting to a database is an asynchronous operation
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB Connected via Prisma");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);

    // process.exit(1) will immediately stop the Node.js app from running,
    // and tell the system it stopped due to an error
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
