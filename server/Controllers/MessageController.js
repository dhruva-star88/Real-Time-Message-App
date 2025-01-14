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

    if (file) {
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

// Retrieve a specific file
export const getFile = (req, res) => {
    const { filename } = req.params;

    const downloadStream = bucket.openDownloadStreamByName(filename);

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