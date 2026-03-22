const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', tripController.getTrips);
router.get('/:id', tripController.getTripById);
router.post('/', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER']), tripController.createTrip);
router.put('/:id/status', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DRIVER']), tripController.updateTripStatus);

module.exports = router;
