const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const ticketController = require('../controllers/ticketController');
const upload = require('../middleware/uploads');

const router = express.Router();

router.route('/')
  .get(protect, ticketController.getAllTickets)
  .post(protect, upload.array('attachments', 3), ticketController.createTicket);

router.route('/:id')
  .get(protect, ticketController.getTicket)
  .patch(protect, ticketController.updateTicket)
  .delete(protect, restrictTo('admin'), ticketController.deleteTicket);

router
  .route("/:id/comments")
  .post(protect, ticketController.addComment);


module.exports = router;
