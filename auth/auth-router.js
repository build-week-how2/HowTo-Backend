const express = require("express");
const router = express.Router();
const Users = require("./auth-model");

const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const user = req.body;
  console.log(user);

  const hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;

  try {
    const users = await Users.add(user);
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  req.session.loggedin = false;

  try {
    const user = await Users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.loggedin = true;
      res.status(200).json({ message: `Welcome ${username}` });
    } else {
      res.status(401).json({ message: "Please provide credentials" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
