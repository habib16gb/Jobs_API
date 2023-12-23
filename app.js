require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
// const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const swagger = require("swagger-ui-express");
const YAML = require("yamljs");

const express = require("express");
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const authenticationUser = require("./middleware/authentication");
const mongoDB = require("./db/connect");
const colors = require("colors");
const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   // store: ... , // Use an external store for consistency across multiple server instances.
// });

// app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());

// routes

app.get("/", (req, res) => {
  res
    .status(200)
    .send("<h1>Jobs API</h1><a href='/api-docs'>Documentation</a>");
});

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticationUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`.bgGreen.bold)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
