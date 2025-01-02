import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./utils/dbConnect";
import taskRoutes from "./routes/taskRoutes";
import docRouter from "./routes/reDoc";
import path from "path";

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "TODO api server" });
});

// app.get("/api-docs", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "openapi.yaml"));
// });

// app.get("/docs", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "public", "redoc.html"));
// });

app.use(docRouter);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
