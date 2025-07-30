const router = require('express').Router()
const { questionController } = require('../controller')
const { verifyUsersToken } = require('../config')
const upload = require("../middlewares/upload");

router.post('/', verifyUsersToken, upload.none(""), questionController.create)
router.get('/', questionController.getAll)
router.get('/:id', questionController.getById)
router.put('/:id', verifyUsersToken, upload.none(""), questionController.update)
router.delete('/:id', verifyUsersToken, questionController.delete)

module.exports = router
