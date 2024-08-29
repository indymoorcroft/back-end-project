const { getUsers } = require("../controllers/user-controllers");

const express = require("express");
const userRouter = express.Router();

userRouter.get("/api/users", getUsers);

module.exports = userRouter;
