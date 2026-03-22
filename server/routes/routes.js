const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', routeController.getRoutes);
router.get('/:id', routeController.getRouteById);
router.post('/', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER']), routeController.createRoute);
router.put('/:id', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER']), routeController.updateRoute);
router.delete('/:id', roleCheck(['SUPER_ADMIN']), routeController.deleteRoute);

module.exports = router;
