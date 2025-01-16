import express from "express";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import authRoutes from "./Routes/authRoutes.js";
import bodyParser from "body-parser";
import AllUserDataRoute from "./Routes/AllUserDataRoute.js";
import mongoose from "mongoose";
import cors from "cors"; 

const app = express();

// Use cors middleware
const corsOptions = {
  origin: '*',  // Allow all origins (you can restrict it to your front-end domain)
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));
app.use(bodyParser.json()); 

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT isn't set

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use("/user", UserRoute);
app.use('/auth', authRoutes);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/api", AllUserDataRoute);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Message-App', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);  // Exit the process if MongoDB connection fails
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
