import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import MessageModel from "../Models/MessageModel.js";

// MongoDB connection setup
const conn = mongoose.connection;
let bucket;

// Initialize GridFSBucket when the connection is open
conn.once('open', () => {
    bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
    console.log("GridFSBucket Connection established and 'uploads.files' collection selected");
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add message with optional attachment
export const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const file = req.file ? req.file : null;

    console.log("Received File:", req.file);  // Log file details

    let attachmentType = 'unknown';  // Default to unknown if no file or an unsupported type

    if (file) {
        // Determine the attachment type based on the MIME type
        if (file.mimetype.startsWith('image/')) {
            attachmentType = 'image';  // Set to image for image files
        } else if (file.mimetype === 'application/pdf') {
            attachmentType = 'file';  // Set to file for non-image files like PDFs
        }

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);

        const uploadStream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
        });

        readableStream.pipe(uploadStream)
            .on('finish', async () => {
                const fileId = uploadStream.id;  // Get the file ID after the upload finishes
                console.log("File uploaded successfully with ID:", fileId);

                const message = new MessageModel({
                    chatId,
                    senderId,
                    text,
                    attachment: fileId,  // Store the file ID in the message
                    attachmentType,  // Store the attachment type (image/file/unknown)
                });

                try {
                    const result = await message.save();
                    res.status(200).json(result);
                } catch (error) {
                    res.status(500).json(error);
                }
            })
            .on('error', (err) => {
                console.error('Error uploading file:', err);
                res.status(500).send('Error uploading file');
            });
    } else {
        // If no file, just create a message with text
        const message = new MessageModel({
            chatId,
            senderId,
            text,
        });

        try {
            const result = await message.save();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

// Retrieve a specific file by its ObjectId
export const getFile = (req, res) => {
    const { attachmentId } = req.params;

    // Ensure the attachmentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(attachmentId)) {
        return res.status(400).send('Invalid file ID');
    }

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(attachmentId));

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('end', () => {
        res.end();
    });

    downloadStream.on('error', (err) => {
        console.error('Error retrieving file:', err);
        res.status(500).send('Error retrieving file');
    });
};

// Get all messages for a specific chat
export const getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
