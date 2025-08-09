const router = require("express").Router();
const { subjectController } = require("../controller");
const { verifyUsersToken } = require("../config");
const upload = require("../middlewares/upload");

router.get("/", verifyUsersToken, subjectController.getAll);
router.get("/:id", subjectController.getOne);
router.post("/", verifyUsersToken, upload.none(''), subjectController.create);
router.put("/:id", verifyUsersToken, upload.none(''), subjectController.update);
router.delete("/:id", verifyUsersToken, subjectController.remove);

module.exports = router;
