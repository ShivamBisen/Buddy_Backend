const { Router } = require('express');
const { saveLikedYoga, getLikedYoga } = require('../controllers/yoga');

const router = Router();

router.post('/liked', saveLikedYoga);
router.post('/getliked', getLikedYoga)

module.exports = router;
