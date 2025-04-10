import express, { Request, Response } from "express";
import { UserModel } from "../../db/db";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

const router = express.Router();
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ 
        email 
    });

    if (!user) {
       res.status(403).json({ message: "Invalid Credentials" });
       return ;
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(403).json({ message: "wrong Password" });
      return;
    }

    const userId = user._id;

    
    const token = jwt.sign(
        {
          userId,
        },
        JWT_SECRET
      );


    res.json({ token : token });

  } catch (e: any) {

    res.status(500).json({ 
        message: "Error", 
        error: e.message
     });
  }
});

export default router;

// {
//   "email":"test1@email.com",
//   "password":"password1",
// }