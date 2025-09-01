//packages
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//utiles
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import bodyParser from 'body-parser';

// import stripeRoutes from './routes/stripeRoutes.js';
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();
const app = express();

// Enable CORS for your frontend
const allowedOrigins = [
  "https://shopnest-live.vercel.app",
  "https://shopnest-live-oa9hzt7dj-kushhagrasaxenas-projects.vercel.app",
  "http://localhost:5173", // optional for local dev
  "https://shopnest-live-git-main-kushhagrasaxenas-projects.vercel.app",
  "https://shopnest-live-gr3lps0cp-kushhagrasaxenas-projects.vercel.app",
"https://shopnest-live-n0cban23l-kushhagrasaxenas-projects.vercel.app/"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow REST clients or curl
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.use('/api/payments/webhook', bodyParser.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/users',userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes); // ✅ mount the payment route

app.get('/api/config/paypal',(req,res) => {
  res.send({clientID: process.env.PAYPAL_CLIENT_ID })
});

// create my own api End-point
app.get("/api/products", (req, res) => {
  res.send("List of products");
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));