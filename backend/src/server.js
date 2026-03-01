
import express from 'express';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import {ENV} from './lib/env.js';

dotenv.config();


const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 5000;

app.use(express.json());
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

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log("Server is running on port:" + PORT));
};

startServer().catch((error) => {
    console.error("Server startup failed:", error?.message || error);
    process.exit(1);
});
