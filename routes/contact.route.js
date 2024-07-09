var express = require('express');
const multer = require('multer');
var router = express.Router();
const contactController = require('../controller/contact.controller');
const contactValidation = require('../middleware/validation/contact.validation');

const storage = multer.diskStorage({
    destination: './resources/assets/image',
    filename: (req, file, cb) => {
        const uniqueId = Date.now();
        const fileExtension = file.originalname.split('.').pop();
        cb(null, `${uniqueId}.${fileExtension}`);
    }
});

const upload = multer({ storage: storage });

router.get('/', contactController.getContactList);

router.post('/add', upload.single("image"), contactValidation.Validation, contactController.postAddContact);

router.post('/list', contactController.postContactList);

router.post('/group', contactController.postContactgroup);

router.patch('/update/:id', upload.single("image"), contactValidation.Validation, contactController.patchUpdateContact);

router.delete('/delete/:id', contactController.deleteContact);



module.exports = router;
