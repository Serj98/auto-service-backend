// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API functionează!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
