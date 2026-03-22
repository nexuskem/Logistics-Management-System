const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

router.get('/', expenseController.getExpenses);
router.post('/', roleCheck(['SUPER_ADMIN', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER']), expenseController.createExpense);

router.get('/fuel', expenseController.getFuelLogs);
router.post('/fuel', roleCheck(['SUPER_ADMIN', 'FINANCE_OFFICER', 'OPERATIONS_MANAGER', 'DRIVER']), expenseController.createFuelLog);

module.exports = router;
