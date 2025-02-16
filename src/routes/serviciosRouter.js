const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/serviciosController');

router.get('/all', servicioController.getAll);

module.exports = router;
