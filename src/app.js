const express = require('express');
const cors = require('cors');
require('dotenv').config();


const comercioRoutes = require('./routes/comercioRoutes');
const serviciosRoutes = require('./routes/serviciosRouter');

const app = express();
app.use(express.json({ limit: '990mb' }));
app.use(express.urlencoded({ limit: '990mb', extended: true, parameterLimit: 900000 }));

app.use(cors());
app.use(express.json());

app.use('/api/comercios', comercioRoutes);
app.use('/api/servicios', serviciosRoutes);

module.exports = app;
