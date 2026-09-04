import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import movieRoute from "./routes/movieRoutes.js";

/*
    config() loads environment variables from a .env file
    in my project into process.env

    After calling config(), I can access environment variables
    anywhere in my app via PROCESS.env.ENV_VAR e.g PROCESS.env.DATABASE_URL

    Lastly, putting it before initializing my express app ensures that
    any variables defined in my .env file are available via process.env
    before the rest of the app starts using them.
*/
config();

// Connect to the DB
connectDB();

const app = express();
app.use("/movie", movieRoute);

const PORT = 5001;

app.listen(PORT, () => console.log("App is running"));

/*
    When connecting to a database, I need to gracefully handle any
    issues that may occur if the connection fails without breaking the
    entire application. This is to ensure the app can still function
    to a point without it breaking.
    
    These codes take care of 3 ideal situations where problems can occur
    at the server level while connecting to the db.
*/

// Handle unhandled promise rejections (e.g database connection errors)
process.on("unhandledrejection", (err) => {
  console.error("Unhandled rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Graceful shutdown of the DB
process.on("SIGTERM", (err) => {
  console.error("SIGTERM Received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});
