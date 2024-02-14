const express = require("express");
const router = express.Router();
const { getBalance } = require("../controllers/balanceController");

router.get("/", getBalance);

module.exports = router;
