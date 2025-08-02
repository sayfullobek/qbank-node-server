// routes/auth.route.js
const router = require("express").Router();
const { authController } = require("../controller");
const { verifyUsersToken } = require("../config");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/get-me/:id", verifyUsersToken, authController.getMe);

module.exports = router;
