import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import urlRoutes from './routes/urlRoutes';

const app = express();

app.use(express.json());

// Apply rate limiter to all requests
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

app.use(urlRoutes);

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/node_ts_crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

export default app;
