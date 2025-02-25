const express = require('express');
const cors = require('cors');
const { connectDb } = require('./db');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5002;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Project service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to database', error);
    });
 