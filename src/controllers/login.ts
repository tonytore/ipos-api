import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import generateAccessToken from "@/utils/generateJWT";
export async function authorizaUser(req: Request, res: Response) {
    const { username, email, password } = req.body;
  
    try {
      let existingUser = null
      if(email){
        existingUser = await db.user.findUnique({
          where: {
            email,
          },
        });
      }

      if(username){
        existingUser = await db.user.findUnique({
          where: {
            username,
          },
        });
      }

      if(!existingUser){
        return res.status(403).json({
            message: "Wrong Credentials"
        });
      }
    const passwordMatch = await bcrypt.compare(password,existingUser.password)
  
    if(!passwordMatch){
        return res.status(403).json({
            message: "Wrong Credentials"
        });
      }
     const {password:userPass, ...userWithoutPassword} = existingUser
     const accessToken = generateAccessToken(userWithoutPassword)
     const result = {
        ...userWithoutPassword,
        accessToken
     }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
          error: "Something went wrong",
          data:null
      })
    }
  }