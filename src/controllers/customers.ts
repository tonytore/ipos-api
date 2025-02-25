import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCustomer(req: Request, res: Response){
  const { 
    customerType,
    firstName,
    lastName,
    phone,
    gender,
    country,
    location,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    email,
    NIN 
  } = req.body;
 
  try {
   if (email) {
    const existingEmail = await db.customer.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return res
        .status(409)
        .json({
          error: `Email with this name ${email} already exists`,
          data:null
        });
    }
   }
  if (phone) {
    const existingPhone = await db.customer.findUnique({
      where: {
        phone,
      },
    });
    if (existingPhone) {
      return res
        .status(409)
        .json({
          error: `Phone with this name ${phone} already exists`,
          data:null
        });
    }
  }
  if (NIN) {
    const existingNIN = await db.customer.findUnique({
      where: {
        NIN,
      },
    });
    if (existingNIN) {
      return res
        .status(409)
        .json({
          error: `Phone with this name ${phone} already exists`,
          data:null
        });
    }
  }
    const newCustomer = await db.customer.create({
      data:{
        customerType,
        firstName,
        lastName,
        phone,
        gender,
        country,
        location,
        maxCreditLimit,
        maxCreditDays,
        taxPin,
        email,
        NIN },
    })
    
    return res.status(201).json(newCustomer);
  } catch (error) {
    console.log(error);
    
  }


}
export async function getCustomers(req: Request, res: Response) {
 try {
  const customers = await db.customer.findMany({
    orderBy:{
      createdAt:"desc"
    }
   })
  
    return res.status(200).json(customers);
 } catch (error) {
  console.log(error);
  
 }
}

export async function getCustomerById(req: Request, res: Response) {
  const { id } = req.params;
   try {
    const customer = await db.customer.findUnique({
      where:{
        id,
      },
    })
    return res.status(200).json(customer);
   } catch (error) {
    
   }
 

 
}
