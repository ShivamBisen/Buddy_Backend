const { Router } = require('express');
const { saveLikedYoga, getLikedYoga } = require('../Controller/yogaController');

const router = Router();

router.post('/liked', saveLikedYoga);
router.post('/getliked', getLikedYoga)

module.exports = router;
