const express = require('express');
const router = express.Router();
const contactCtrl = require('../Controllers/contactController');

router.post('/', contactCtrl.createContact);

module.exports = router;
