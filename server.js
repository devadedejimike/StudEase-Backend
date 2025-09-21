const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to MongoDB
mongoose.connect(process.env.CONN_STR)
  .then(() => console.log('DB connection successful'))
  .catch(err => console.log('DB connection error:', err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
