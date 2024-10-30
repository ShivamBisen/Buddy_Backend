const { Router } = require("express");
const { register, getSecurityQuestion, login } = require("../controllers/auth");
const router = Router();

router.post("/register", register);

router.post("/security-question", getSecurityQuestion);

router.post("/login", login);

module.exports = router;
