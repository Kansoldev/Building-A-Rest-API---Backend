import express from "express";
import movieRoute from "./routes/movieRoutes.js";

const app = express();
app.use("/movie", movieRoute);

const PORT = 5001;

app.listen(PORT, () => console.log("App is running"));
