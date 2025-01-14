import express from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { MongoClient, GridFSBucket } from "mongodb"
import { addMessage, getFile, getMessages } from "../Controllers/MessageController.js"

const router = express.Router()

const mongoURI = 'mongodb://localhost:27017/souloxy-chat'
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create MongoDB client and connect
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' }); 
});


// Post method to upload the file top mongo-db
router.post("/", upload.single('attachment') ,addMessage)
router.get("/:chatId", getMessages)

// Route to get the file (attachment)
router.get('/file/:filename', getFile);

export default router
