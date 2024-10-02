const { Router } = require('express');
const { uploadFile, getData } = require('../Controller/uploadController');

const router = Router();

router.post('/upload', uploadFile);
router.post("/getdata",getData)

module.exports = router;
