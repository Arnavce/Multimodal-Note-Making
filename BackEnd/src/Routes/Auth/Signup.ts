import express, { Request, Response } from "express";
import { UserModel } from "../../db/db";
import bcrypt from "bcrypt";  

const router = express.Router();
const SALT_ROUNDS = 10;

router.post("/", async (req: Request, res: Response): Promise<void> => {

  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);


  try {

      const existinguser = await UserModel.findOne({ 
          email 
      });

      if (existinguser) {
        res.status(403).json({ message: "User already exists" });
        return ;
      }

    const user = await UserModel.create
    ({ email, 
       password : hashedPassword, 
       name });


    res.json({
      message: "User Registered Successfully",
      user,
    });


  }
   catch (e: any) {
    if (e.name === "MongoError" && e.code === 11000) {

      res.status(400).json({
     message: "User already exists" 
    });

    } else if (e.name === "MongoNetworkError") {

      res.status(500).json({
         message: "Database connection error" 
        });

    } else {

      res.status(500).json({ 
        message: "Kuch toh error hai", 
        error: e.message
     });
    }
  }
});



router.get("/", async (req: Request, res: Response): Promise<void> => {

  const user = await UserModel.find({});

  res.json({
    message: "Users found",
    user,
  }); 

});

export default router;


// {
//   "email":"test1@email.com",
//   "password":"password1",
//   "name":"test"
// }