const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id }
    });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { plate, make, model, year, capacity, type, status } = req.body;
    const vehicle = await prisma.vehicle.create({
      data: { plate, make, model, year: parseInt(year), capacity: parseFloat(capacity), type, status }
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

module.exports = {
  getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle
};
