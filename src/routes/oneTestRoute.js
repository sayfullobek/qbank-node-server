const express = require("express");
const router = express.Router();
const {noteController, oneTestController} = require("../controller");
const { verifyUsersToken } = require("../config");

router.get("/", verifyUsersToken, oneTestController.getAll);
router.get("/test/:testId", verifyUsersToken, oneTestController.getByTestId);

module.exports = router;

