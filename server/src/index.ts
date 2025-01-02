import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./utils/dbConnect";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "TODO api server" });
});

app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
