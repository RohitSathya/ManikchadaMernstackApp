const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const cors=require('cors')
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Failed to connect to MongoDB', err));


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
