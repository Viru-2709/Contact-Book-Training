var express = require('express');
var router = express.Router();
const groupController = require('../controller/group.conrtoller');
const groupValidation = require('../middleware/validation/group.validation');

router.post('/add', groupValidation.Validation, groupController.postAddGroup);

router.post('/list', groupController.postGroupList);

router.patch('/update/:id', groupValidation.Validation, groupController.patchUpdateGroup);

router.delete('/delete/:id', groupController.deleteGroup);

router.get('/', groupController.getGroupList);


module.exports = router;