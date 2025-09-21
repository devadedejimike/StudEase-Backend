const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { getTicketStats, exportTickets } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getTicketStats);
router.get('/export', exportTickets);

module.exports = router;
