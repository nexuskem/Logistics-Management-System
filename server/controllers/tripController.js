const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendSms } = require('../services/smsService');

const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: true,
        driver: true,
        client: true,
        route: true
      }
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true,
        driver: true,
        client: true,
        route: true,
        invoices: true,
        expenses: true,
        fuelLogs: true
      }
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const { vehicle_id, driver_id, client_id, route_id, status, cargo_details, pickup_date, delivery_date } = req.body;
    const trip = await prisma.trip.create({
      data: {
        vehicle_id,
        driver_id,
        client_id,
        route_id,
        status,
        cargo_details,
        pickup_date: new Date(pickup_date),
        delivery_date: new Date(delivery_date)
      },
      include: { driver: true, client: true, vehicle: true }
    });
    
    // Update vehicle and driver status to ON_TRIP
    await prisma.vehicle.update({ where: { id: vehicle_id }, data: { status: 'ON_TRIP' } });
    await prisma.driver.update({ where: { id: driver_id }, data: { status: 'ON_TRIP' } });
    
    // Send SMS to Driver
    if (trip.driver?.phone) {
      await sendSms(trip.driver.phone, `You have been assigned a new trip on ${new Date(pickup_date).toLocaleDateString()} with vehicle ${trip.vehicle?.plate}. Cargo: ${cargo_details}.`);
    }

    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const updateTripStatus = async (req, res) => {
  try {
    const { status, actual_delivery } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(actual_delivery && { actual_delivery: new Date(actual_delivery) })
      },
      include: { driver: true, client: true }
    });

    // If trip completed or cancelled, free up vehicle and driver
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      await prisma.vehicle.update({ where: { id: trip.vehicle_id }, data: { status: 'AVAILABLE' } });
      await prisma.driver.update({ where: { id: trip.driver_id }, data: { status: 'AVAILABLE' } });
    }

    // Send SMS to client upon DISPATCHED or DELIVERED
    if (trip.client?.phone) {
      if (status === 'DISPATCHED') {
         await sendSms(trip.client.phone, `Your shipment is now Dispatched. Track via your LMS portal.`);
      } else if (status === 'DELIVERED') {
         await sendSms(trip.client.phone, `Your shipment has been Delivered successfully.`);
      }
    }

    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

module.exports = {
  getTrips, getTripById, createTrip, updateTripStatus
};
