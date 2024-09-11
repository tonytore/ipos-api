import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import generateAccessToken from "@/utils/generateJWT";
import { addMinutes } from "date-fns";
import { Resend } from "resend";
import { generateEmailHTML } from "@/utils/generateEmailTemplate";
import { generateToken } from "@/utils/generateToken";

const resend = new Resend(process.env.RESEND_API_KEY)


export async function authorizUser(req: Request, res: Response) {
  const { username, email, password } = req.body;

  try {
    let existingUser = null;
    if (email) {
      existingUser = await db.user.findUnique({
        where: {
          email,
        },
      });
    }

    if (username) {
      existingUser = await db.user.findUnique({
        where: {
          username,
        },
      });
    }

    if (!existingUser) {
      return res.status(403).json({
        message: "Wrong Credentials",
      });
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(403).json({
        message: "Wrong Credentials",
      });
    }
    const { password: userPass, ...userWithoutPassword } = existingUser;
    const accessToken = generateAccessToken(userWithoutPassword);
    const result = {
      ...userWithoutPassword,
      accessToken,
    };
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }

    const resetToken = generateToken();
    const resetTokenExpiry = addMinutes(new Date(), 10);
    const currentTime = new Date();

    const updateUser = await db.user.update({
      where: {
        email,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })


    const {data,error} = await resend.emails.send({
      from:"Ipos App <onboarding@resend.dev>",
      to:email,
      subject:"Password Reset Request",
      html:generateEmailHTML(resetToken)
    })

  if(error){
    return res.status(400).json({ error})
  }

  const result = {
    userId:updateUser.id,
    emailId:data?.id,
    time:currentTime
  }

    return res.status(200).json({
        message: `Password reset email sent to ${email}`,
        data:result,
        validToken:resetToken
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Something went wrong`,
      data:null
  })
}

}

export async function verifyToken(req: Request, res: Response) {
  const { resetToken } = req.params;
  try {
    const existingUser = await db.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry:{
          gte: new Date()
        }
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        data: null,
        error: "Invalid or Expired token",
      });
    }
 res.status(200).json({
  message:"Token is valid"
 });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Something went wrong`,
      data:null
  })
}

}

export const changePassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;
 
  try {
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });
 
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
 
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
 
    // Update the user's password and clear the reset token and expiry
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
 
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

