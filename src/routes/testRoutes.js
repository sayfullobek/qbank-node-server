const express = require('express');
const router = express.Router();
const testController = require('../controller/testController');
const { verifyUsersToken } = require('../config');
const upload = require('../middlewares/upload');

// POST /api/tests - create new test
router.post('/', verifyUsersToken, upload.none(), testController.createTest);
router.put('/:testId', verifyUsersToken, upload.none(), testController.createOneTestAndPushToTest);

// GET /api/tests - get all tests by user
router.get('/', verifyUsersToken, testController.getAllTests);

// GET /api/tests/:id - get single test by id
router.get('/:id', verifyUsersToken, testController.getTestById);
router.get('/user-test/:id', verifyUsersToken, testController.getTestByIdUser);

router.get('/check/:id/:questionId', verifyUsersToken, testController.checkIsActiveTest);

router.put('/status/:id', verifyUsersToken, upload.none(), testController.updateTestStatus)
router.put('/mark/:testId/:questionId', verifyUsersToken, upload.none(), testController.updateMarkStatus);

// DELETE /api/tests/:id - delete test and reset OneTest records
router.delete('/:id', verifyUsersToken, testController.deleteTest);

module.exports = router;
