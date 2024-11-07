const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 7000;

const authRoutes = require('./routes/auth');
const { connect } = require('./db/connect');

async function main() {
  app.use(express.json());
  app.use(cors());
  await connect();

  app.use('/auth', authRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route Not found' });
  });
  app.use((err, req, res, next) => {
    // console.log(err);
    console.log(err.status);
    res.status(err.status || 500).json({
      // status: "failed",
      // code: err.status,
      message: err.message || 'Internal Server Error',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();
