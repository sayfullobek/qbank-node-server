const router = require('express').Router();
const { systemsController } = require('../controller');
const { verifyUsersToken } = require('../config');
const upload = require("../middlewares/upload");

router.get('/', verifyUsersToken, systemsController.getAll);
router.get('/:id', systemsController.getOne);
router.post('/', verifyUsersToken, upload.none(''), systemsController.create);
router.put('/:id', verifyUsersToken, upload.none(''), systemsController.update);
router.delete('/:id', verifyUsersToken, systemsController.remove);

module.exports = router;
