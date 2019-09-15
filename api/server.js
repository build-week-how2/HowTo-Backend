const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const authRouter = require("../auth/auth-router");
const userRouter = require("../users/user-router.js");
const auth = require("../auth/auth-middleware");

const server = express();

const sessionOptions = {
  name: "sessioncookie",
  secret: "cookies for the sessions",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: true,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("../database/dbConfig"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

server.get("/", (req, res) => {
  res.status(200).json({ api: "Ready to go" });
});

server.use("/api/auth", authRouter);
server.use("/api/users", auth, userRouter);


module.exports = server;
