import express from "express";
import routes from "./routes/routes.js";

const app = express();
app.use(express.json());

app.use("/", routes);

app.listen(5000, () => console.log("Backend server is running!"));
