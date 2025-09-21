const Ticket = require('../models/ticketModel');

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      student: req.user._id, // always set from logged-in user
    });

    res.status(201).json({
      status: "success",
      data: { ticket },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const query = req.user.role === 'student' ? { student: req.user._id } : {};
    const tickets = await Ticket.find(query).populate('student', 'name matricNo role').sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: tickets.length, data: { tickets } });
  } catch (err) { res.status(404).json({ status: 'fail', message: err.message }); }
};

exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', 'name matricNo role')
      .populate('comments.user', 'name matricNo role');
    if (!ticket) return res.status(404).json({ status: 'fail', message: 'Ticket not found' });
    res.status(200).json({ status: 'success', data: { ticket } });
  } catch (err) { res.status(404).json({ status: 'fail', message: err.message }); }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("comments.user", "name matricNo role");
    if (!ticket) return res.status(404).json({ status: 'fail', message: 'Ticket not found' });

    const allowedFields = req.user.role === 'admin' ? ['title','issue','status','category'] : ['title','issue','category'];
    Object.assign(ticket, Object.fromEntries(Object.entries(req.body).filter(([k]) => allowedFields.includes(k))));
    await ticket.save();
    res.status(200).json({ status: 'success', data: { ticket } });
  } catch (err) { res.status(400).json({ status: 'fail', message: err.message }); }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ status: 'fail', message: 'Ticket not found' });
    await ticket.deleteOne();
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { res.status(404).json({ status: 'fail', message: err.message }); }
};

// add comment to ticket
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // The user making the request (decoded from JWT in auth middleware)
    const userId = req.user._id;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ status: "error", message: "Ticket not found" });
    }

    // Push new comment with userId
    ticket.comments.push({ user: userId, message });
    await ticket.save();

    // Re-fetch ticket so comment.user is populated
    await ticket.populate("comments.user", "name matricNo role");

    // Return the last comment (the one just added)
    const newComment = ticket.comments[ticket.comments.length - 1];

    res.json({
      status: "success",
      data: { comment: newComment }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
