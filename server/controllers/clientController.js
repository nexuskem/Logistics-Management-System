const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: { trips: true, invoices: true }
    });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createClient = async (req, res) => {
  try {
    const { name, company, email, phone, address, payment_terms } = req.body;
    const client = await prisma.client.create({
      data: { name, company, email, phone, address, payment_terms }
    });
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    await prisma.client.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

module.exports = {
  getClients, getClientById, createClient, updateClient, deleteClient
};
