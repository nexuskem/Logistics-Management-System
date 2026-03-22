const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: req.params.id }
    });
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createRoute = async (req, res) => {
  try {
    const { name, origin, destination, distance_km, duration_hrs } = req.body;
    const route = await prisma.route.create({
      data: { name, origin, destination, distance_km: parseFloat(distance_km), duration_hrs: parseFloat(duration_hrs) }
    });
    res.status(201).json(route);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const updateRoute = async (req, res) => {
  try {
    const route = await prisma.route.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const deleteRoute = async (req, res) => {
  try {
    await prisma.route.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

module.exports = {
  getRoutes, getRouteById, createRoute, updateRoute, deleteRoute
};
