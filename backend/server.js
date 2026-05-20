const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();


// Middleware
app.use(express.json());

app.use(cors());


//import routes

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const parkingSlotRoutes = require('./routes/parkingSlotRoutes');
const parkingRecordRoutes = require('./routes/parkingRecordRoutes');
const paymentRoutes = require('./routes/paymentRoutes')

//use routes
app.use('/api/auth', authRoutes);
app.use('/api/car', carRoutes);
app.use('/api/slot', parkingSlotRoutes);
app.use('/api/record', parkingRecordRoutes);
app.use('/api/payment', paymentRoutes);

// Server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});