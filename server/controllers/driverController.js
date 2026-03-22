const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
      include: { trips: true }
    });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, phone, license_no, license_class, expiry, status } = req.body;

    // Validate that expiry is a valid, parseable date — reject garbage like
    // dates with bogus years that come from partial/programmatic typing.
    const expiryDate = new Date(expiry);
    if (!expiry || isNaN(expiryDate.getTime()) || expiryDate.getFullYear() > 2100) {
      return res.status(400).json({ error: 'Bad request', message: 'Invalid license expiry date. Expected format: YYYY-MM-DD' });
    }

    const driver = await prisma.driver.create({
      data: { name, phone, license_no, license_class, expiry: expiryDate, status }
    });
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const updateDriver = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.expiry) data.expiry = new Date(data.expiry);
    
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data
    });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const deleteDriver = async (req, res) => {
  try {
    await prisma.driver.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

module.exports = {
  getDrivers, getDriverById, createDriver, updateDriver, deleteDriver
};
