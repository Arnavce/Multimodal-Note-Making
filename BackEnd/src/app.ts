 
import express from "express";

import usersRouter from "./Routes/Auth/Signup";
import loginRouter from "./Routes/Auth/Login";
import notesRouter from "./Routes/Notes/Notes";
import canvasRouter from "./Routes/Canvas/Canvas";
import tlrouter from "./Routes/tldraw/tldraw";

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/v0/auth/signup", usersRouter); 
app.use("/api/v0/auth/login", loginRouter);
app.use("/api/v0/notes", notesRouter);
app.use("/api/v0/canvas", canvasRouter);
app.use("/api/v0/tldraw", tlrouter);




export default app;
