// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const carRoutes = require('./routes/carRoutes');
const visitRoutes = require('./routes/visitRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/cars', carRoutes);
app.use('/visits', visitRoutes);

app.get('/', async (req, res) => {
    res.send('API functionează!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
