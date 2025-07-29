// routes/auth.route.js
const router = require("express").Router();
const { authController } = require("../controller");
const { verifyUsersToken } = require("../config");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyUsersToken, authController.getMe);

module.exports = router;
