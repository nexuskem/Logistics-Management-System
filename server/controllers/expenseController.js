const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
      include: { vehicle: true, trip: true }
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { vehicle_id, trip_id, category, amount, date, notes } = req.body;
    const expense = await prisma.expense.create({
      data: {
        vehicle_id,
        trip_id,
        category,
        amount: parseFloat(amount),
        date: new Date(date),
        notes
      }
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const getFuelLogs = async (req, res) => {
  try {
    const fuelLogs = await prisma.fuelLog.findMany({
      orderBy: { date: 'desc' },
      include: { vehicle: true, trip: true }
    });
    res.json(fuelLogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createFuelLog = async (req, res) => {
  try {
    const { vehicle_id, trip_id, litres, cost_per_litre, station, date } = req.body;
    const total = parseFloat(litres) * parseFloat(cost_per_litre);
    const fuelLog = await prisma.fuelLog.create({
      data: {
        vehicle_id,
        trip_id,
        litres: parseFloat(litres),
        cost_per_litre: parseFloat(cost_per_litre),
        total,
        station,
        date: new Date(date)
      }
    });

    // Also log this as an expense automatically
    await prisma.expense.create({
      data: {
        vehicle_id,
        trip_id,
        category: 'FUEL',
        amount: total,
        date: new Date(date),
        notes: `Fuel logged from station: ${station}`
      }
    });

    res.status(201).json(fuelLog);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

module.exports = {
  getExpenses, createExpense, getFuelLogs, createFuelLog
};
