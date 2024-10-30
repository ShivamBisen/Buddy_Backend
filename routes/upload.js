const { Router } = require('express');
const { uploadFile, getData } = require('../controllers/upload');

const router = Router();

router.post('/upload', uploadFile);
router.post("/getdata",getData)

module.exports = router;
