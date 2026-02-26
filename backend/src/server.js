
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();


const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log("Server is running on port:" + PORT));
    };
    
    startServer().catch((error) => {
      console.error("Server startup failed:", error?.message || error);
      process.exit(1);
    });
    
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
const distPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}

app.listen(PORT, () => console.log("Server is running on port:" + PORT));
