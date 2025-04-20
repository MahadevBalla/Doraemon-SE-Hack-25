import express from "express";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"
// @ts-ignore
import connectDB from "./db/db.js"
import app from "./app.js"
import http from "http"
import { initSocket } from "./socket.js"


dotenv.config();

connectDB()
    .then(() => {
        const server = http.createServer(app);

        // 🔌 Attach socket.io to server
        initSocket(server);
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed", err);
    })

const server = http.createServer(app);
