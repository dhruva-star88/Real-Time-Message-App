import express from "express";
import multer from "multer";
import { MongoClient, GridFSBucket } from "mongodb";
import { addMessage, getFile, getMessages, updateReadStatus } from "../Controllers/MessageController.js";

const router = express.Router();

const mongoURI = 'mongodb://localhost:27017/souloxy-chat';
const storage = multer.memoryStorage();
const upload = multer({ storage });

let bucket; // Declare bucket to use for GridFSBucket

// Create MongoDB client and connect
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db();
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log("Connected to MongoDB and GridFSBucket initialized");
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Post method to upload the file to MongoDB
router.post("/", upload.single('attachment'), (req, res) => addMessage(req, res, bucket));

// Get all messages for a specific chat
router.get("/:chatId", getMessages);

// Route to get the file (attachment)
router.get('/file/:attachmentId', (req, res) => getFile(req, res, bucket));

// Route to update the read status of a message
router.patch("/read/:messageId", updateReadStatus);

export default router;
