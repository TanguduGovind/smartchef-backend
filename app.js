const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { errorHandler } = require("./middleware/errorMiddleware");
const limiter =
  require("./middleware/rateLimiter");

const authRoutes =
require("./routes/authRoutes");

const app = express();

app.use(limiter);

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartChef API Running",
  });
});

app.use(
 "/api/v1/auth",
 authRoutes
);


app.use(errorHandler);

module.exports = app;