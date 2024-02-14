const express = require("express");
const router = express.Router();
const { seedCustomerAndAccount } = require("../controllers/customerController");

router.get("/seed", seedCustomerAndAccount);

module.exports = router;
