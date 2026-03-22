const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    const totalVehicles = await prisma.vehicle.count();
    const activeTrips = await prisma.trip.count({
      where: {
        status: { in: ['DISPATCHED', 'IN_TRANSIT'] }
      }
    });

    // This month dates
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const invoicesThisMonth = await prisma.invoice.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: startOfMonth },
        status: 'PAID'
      }
    });

    const expensesThisMonth = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: startOfMonth } }
    });

    const pendingDeliveries = await prisma.trip.count({
      where: { status: 'DISPATCHED' }
    });

    // Vehicle status breakdown
    const vehicleStatusBreakdown = await prisma.vehicle.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    // Recent trips
    const recentTrips = await prisma.trip.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { vehicle: true, client: true }
    });

    res.json({
      kpis: {
        totalVehicles,
        activeTrips,
        revenueThisMonth: invoicesThisMonth._sum.total || 0,
        expensesThisMonth: expensesThisMonth._sum.amount || 0,
        pendingDeliveries
      },
      vehicleStatusBreakdown,
      recentTrips
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

module.exports = { getDashboardStats };
