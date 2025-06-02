const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDb } = require('./src/config/db');
const projectRoutes = require('./src/routes/projectRoutes');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const PORT = process.env.SERVER_PORT || 5004;

connectDb()
  .then(() => {
    // ✅ Register routes only after DB is connected
    app.use('/api/projects', projectRoutes);

    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'healthy', service: 'project-service' });
    });

    app.listen(PORT, () => {
      console.log(`Project service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database', error);
  });
