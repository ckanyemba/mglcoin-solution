const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require("cors");
const cron = require("node-cron")
const HttpException = require('../src/utils/HttpException.utils');
const errorMiddleware = require('../src/middleware/error.middleware');
const userRouter = require('../src/routes/api/user.route');
const walletRouter = require('../src/routes/api/wallet.route');
const subscriberRouter = require('../src/routes/api/subscriber.route');
const ieo = require('../src/routes/api/ieo.route');
const p2p = require('../src/routes/api/p2p.route');
const WalletService = require('../src/services/wallet.service');
cron.schedule('*/10 * * * *', () => {
  WalletService.updateTopTokens().then(() => {
    console.log("Top Token data updated")
  })
});

// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
app.use(cookieParser());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());
app.use(
    session({
      key: "user_sid",
      secret: "supersecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 86400000,
      },
    })
  );

const port = Number(process.env.PORT || 5000);
app.use(cookieParser());

app.use(`/api/users/`, userRouter);
app.use(`/api/wallets/`, walletRouter);
app.use(`/api/subscribers`, subscriberRouter);
app.use(`/api/ieo`, ieo);
app.use(`/api/p2p`, p2p);

app.get("/", (req, res) => {
  res.send("Welcome to our mglcoin API...");
});

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));


module.exports = app;