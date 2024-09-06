import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
export async function createUser(req: Request, res: Response) {
  const { username,firstname,lastname, email, password, phone, dob, gender, image } = req.body;

  try {
    const existingUserName = await db.user.findUnique({
      where: {
        username,
      },
    });
    if (existingUserName) {
      return res
        .status(400)
        .json({
          message: `Username with this name ${username} already exists`,
        });
    }

    const existingEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: `this Email ${email} already exists` });
    }

    const existingPhone = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: `this phone ${phone} already exists` });
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await db.user.create({
      data: { 
        username,
        firstname,
        lastname,
         email,
          password:hashedPassword, 
          phone, 
          dob, 
          gender, 
          image : image ? image : "https://utfs.io/f/c61ec63c-42b1-4939-a7fb-ed04d43e23ee-2558r.png"
        },
    });
    const {password:savedPassword,...others} = newUser
    return res.status(201).json({
        data:others,
        error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        error: "Something went wrong",
        data:null
    })
  }
}
export async function getUsers(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
   const filterdUsers = users.map((user)=>{
     const {password,...others} = user
     return others
   })
   return res.status(200).json({
    data:filterdUsers,
    error:null
});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        error: "Something went wrong",
        data:null
    })
  }
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {password, ...others} = user
    return res.status(200).json({
        data:others,
        error:null
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        error: "Something went wrong",
        data:null
    })
    
  }
}
