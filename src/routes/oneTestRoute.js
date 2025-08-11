const express = require("express");
const router = express.Router();
const {noteController, oneTestController} = require("../controller");
const { verifyUsersToken } = require("../config");

router.get("/", verifyUsersToken, oneTestController.getAll);

module.exports = router;

