const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

// Define routes
app.use(cors());
app.use('/api/popular/tv', require('./routes/api/popular/tv'));
app.use('/api/popular/streams', require('./routes/api/popular/streams'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
