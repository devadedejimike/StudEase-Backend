// controllers/adminController.js
const Ticket = require('../models/ticketModel');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

// Helper: Build date filter if query has from/to
const buildDateFilter = (query) => {
  const filter = {};
  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }
  // Status / category
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  
  return filter;
};

// ------------------------------
// 1. Dashboard Stats
// ------------------------------
exports.getTicketStats = async (req, res) => {
  try {
    // Count by status
    const statusStats = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Count by category
    const categoryStats = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Count by period (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentTickets = await Ticket.countDocuments({
      createdAt: { $gte: last30Days }
    });

    res.status(200).json({
      status: 'success',
      data: {
        statusStats,
        categoryStats,
        recentTickets
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// ------------------------------
// 2. Export Tickets
// ------------------------------
exports.exportTickets = async (req, res) => {
  try {
    const format = req.query.format || 'csv'; // csv or excel
    const tickets = await Ticket.find()
      .populate('student', 'name matricNo role')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      // Convert to CSV
      const fields = ['_id', 'title', 'status', 'category', 'issue', 'createdAt'];
      const parser = new Parser({ fields });
      const csv = parser.parse(tickets);

      res.header('Content-Type', 'text/csv');
      res.attachment('tickets.csv');
      return res.send(csv);
    }

    if (format === 'excel') {
      // Convert to Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tickets');

      worksheet.columns = [
        { header: 'ID', key: '_id', width: 24 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Issue', key: 'issue', width: 40 },
        { header: 'Created At', key: 'createdAt', width: 20 }
      ];

      tickets.forEach(ticket => worksheet.addRow(ticket.toObject()));

      res.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.attachment('tickets.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    }
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
