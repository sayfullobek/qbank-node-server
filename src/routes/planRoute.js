const router = require("express").Router();
const { planController } = require("../controller");
const { verifyUsersToken } = require("../config");
const upload = require("../middlewares/upload");

router.post("/", verifyUsersToken, upload.none(''), planController.createPlan);
router.get("/", planController.getAllPlans);
router.get("/:id", planController.getPlanById);
router.put("/:id", verifyUsersToken, upload.none(''), planController.updatePlan);
router.delete("/:id", verifyUsersToken, planController.deletePlan);

module.exports = router;
