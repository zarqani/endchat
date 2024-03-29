const express = require("express");
const { ValidationError } = require("express-validation");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const routes = require("../api/routes");
const { logs } = require("./vars");
const strategies = require("./passport");
const error = require("../api/middlewares/error");
const http = require("http");
const socketio = require("socket.io");
const initSockets = require("../api/sockets");
const path = require("path");
/**
 * Express instance
 * @public
 */
const app = express();

//static file
// app.use("/public", express.static(path.join(__dirname, "../../public")));

// Init server with socket.io and express app
let server = http.createServer(app);
let io = socketio(server, { path: "/chat/socket.io" });

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use("jwt", strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);

// mount api v1 routes
app.use("/api", routes);

// Init all sockets
initSockets(io);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = server;
