const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Protect all routes
router.use(authMiddleware);

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER']), vehicleController.createVehicle);
router.put('/:id', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER']), vehicleController.updateVehicle);
router.delete('/:id', roleCheck(['SUPER_ADMIN']), vehicleController.deleteVehicle);

module.exports = router;
