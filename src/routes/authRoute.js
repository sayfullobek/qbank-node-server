// routes/auth.route.js
const router = require("express").Router();
const { authController } = require("../controller");
const { verifyUsersToken } = require("../config");
const upload = require("../middlewares/upload");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/get-me/:id", verifyUsersToken, authController.getMe);
router.put("/update-profile/:id", verifyUsersToken, upload.none(), authController.update);
router.put("/update-photo/:id", verifyUsersToken, upload.single("photo"), authController.updatePhoto);

module.exports = router;
