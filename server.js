require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router/auth-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

app.use(express.json());

app.use("/api/auth", router);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("<h1>Home routes</h1>");
});

connectDb().then(() => {
  app.listen(3000, () => {
    console.log("listening on 3000");
  });
});
