const {
  getUsers,
  getUserByUsername,
} = require("../controllers/user-controllers");

const express = require("express");
const userRouter = express.Router();

userRouter.get("/api/users", getUsers);

userRouter.get("/api/users/:username", getUserByUsername);

module.exports = userRouter;
