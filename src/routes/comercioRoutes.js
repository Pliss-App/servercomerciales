const express = require('express');
const router = express.Router();
const comercioController = require('../controllers/comercioController');

router.get('/', comercioController.getAllComercios);
router.get('/active', comercioController.getAllComerciosActive);
router.get('/idByService/:id', comercioController.getComercioByIdService);
router.get('/:id', comercioController.getComercioById);
router.post('/crear', comercioController.createComercio);
router.put('/:id', comercioController.updateComercio);
router.delete('/:id', comercioController.deleteComercio);

module.exports = router;
