const router = require('express').Router()
const { questionController } = require('../controller')
const { verifyUsersToken } = require('../config')
const upload = require("../middlewares/upload");

router.post('/', upload.array('photo'), questionController.create);
router.post('/many', upload.none(), questionController.createManyQuestion);
router.put('/:id', upload.array('photo'), questionController.update);
router.get('/', questionController.getAll)
router.get('/:id', questionController.getById)
router.delete('/:id', verifyUsersToken, questionController.delete)

module.exports = router
