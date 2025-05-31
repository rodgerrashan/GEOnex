const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDb } = require('./src/config/db');
const projectRoutes = require('./src/routes/projectRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);


const PORT = process.env.SERVER_PORT || 5004;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Project service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to database', error);
    });
 