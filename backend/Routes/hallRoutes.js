const express = require('express');
const router = express.Router();
const hallController = require('../Controllers/hallController');

router.post('/add', hallController.addHall);
router.get('/get', hallController.getHalls);
// router.get('/all', hallController.getHalls);     
// router.get('/:id', hallController.getHallById);
// router.put('/:id', hallController.updateHall);
router.delete('/delete/:id', hallController.deleteHall);

module.exports = router;
