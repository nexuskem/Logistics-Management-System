const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', roleCheck(['SUPER_ADMIN', 'FINANCE_OFFICER']), invoiceController.createInvoice);
router.put('/:id/status', roleCheck(['SUPER_ADMIN', 'FINANCE_OFFICER']), invoiceController.updateInvoiceStatus);
router.post('/:id/pay', roleCheck(['SUPER_ADMIN', 'FINANCE_OFFICER', 'CLIENT']), invoiceController.triggerStkPush);

// Callbacks shouldn't require auth since Safaricom calls it directly
router.post('/mpesa-callback', invoiceController.mpesaCallback);

module.exports = router;
