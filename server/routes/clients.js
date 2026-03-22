const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.post('/', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_OFFICER']), clientController.createClient);
router.put('/:id', roleCheck(['SUPER_ADMIN', 'OPERATIONS_MANAGER', 'FINANCE_OFFICER']), clientController.updateClient);
router.delete('/:id', roleCheck(['SUPER_ADMIN']), clientController.deleteClient);

module.exports = router;
