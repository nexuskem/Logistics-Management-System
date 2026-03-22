const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendStkPush } = require('../services/mpesaService');

const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: true, trip: true }
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { client: true, trip: { include: { route: true } } }
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { trip_id, client_id, amount, vat } = req.body;
    const total = parseFloat(amount) + parseFloat(vat || 0);
    const invoice = await prisma.invoice.create({
      data: {
        trip_id,
        client_id,
        amount: parseFloat(amount),
        vat: parseFloat(vat || 0),
        total
      }
    });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { status, mpesa_ref } = req.body;
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'PAID' && { paid_at: new Date() }),
        ...(mpesa_ref && { mpesa_ref })
      }
    });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', message: err.message });
  }
};

const triggerStkPush = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true }
    });

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    if (invoice.status === 'PAID') return res.status(400).json({ error: 'Invoice already paid' });

    // Ensure phone is typically a valid Safaricom number format (e.g. 254712345678)
    const phoneNumber = invoice.client.phone.replace(/[^0-9]/g, ''); 
    const response = await sendStkPush(phoneNumber, invoice.total, `INV-${invoiceId.substring(0,6)}`, "Invoice Payment");

    // Optional: Save CheckoutRequestID to DB to match with callback later
    
    res.json({ message: 'STK push initiated successfully', mpesaResponse: response });
  } catch (err) {
    res.status(500).json({ error: 'Failed to initiate STK push', message: err.message });
  }
};

const mpesaCallback = async (req, res) => {
  try {
    console.log('[M-PESA CALLBACK RECEIVED]', req.body);
    // In production, parse req.body.Body.stkCallback
    // If ResultCode === 0, payment successful, update matching Invoice status to PAID
    
    res.json({ message: 'Callback received' });
  } catch (err) {
    res.status(500).json({ error: 'Callback handling failed' });
  }
};

module.exports = {
  getInvoices, getInvoiceById, createInvoice, updateInvoiceStatus, triggerStkPush, mpesaCallback
};
