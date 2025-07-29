const router = require('express').Router()
const { questionController } = require('../controller')
const { verifyUsersToken } = require('../config')

router.post('/', verifyUsersToken, questionController.create)
router.get('/', questionController.getAll)
router.get('/:id', questionController.getById)
router.put('/:id', verifyUsersToken, questionController.update)
router.delete('/:id', verifyUsersToken, questionController.delete)

module.exports = router
