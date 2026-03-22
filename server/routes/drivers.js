const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', driverController.getDrivers);
router.get('/:id', driverController.getDriverById);
router.post('/', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER']), driverController.createDriver);
router.put('/:id', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER']), driverController.updateDriver);
router.delete('/:id', roleCheck(['SUPER_ADMIN']), driverController.deleteDriver);

module.exports = router;
