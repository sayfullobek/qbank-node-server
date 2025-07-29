const router = require("express").Router();
const { levelController } = require("../controller");
const upload = require("../middlewares/upload");
const { verifyUsersToken } = require("../config");

router.post("/", verifyUsersToken, upload.single("photo"), levelController.createLevel);
router.get("/", levelController.getAllLevels);
router.get("/:id", levelController.getLevelById);
router.put("/:id", verifyUsersToken, upload.single("photo"), levelController.updateLevel);
router.delete("/:id", verifyUsersToken, levelController.deleteLevel);

module.exports = router;
