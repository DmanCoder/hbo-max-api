const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

// Define routes
app.use(cors());
app.use('/api/popular/tv', require('./routes/api/popular/tv'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
