import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createSupplier(req: Request, res: Response){
  const { 
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    country,
    location,
    website,
    taxPin,
    regNumber,
    bankAccountNumber,
    bankName,
    paymentTerms,
    logo,
    rating,
    notes
  } = req.body;
 
  try {
   if (email) {
    const existingEmail = await db.supplier.findUnique({
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
    const existingPhone = await db.supplier.findUnique({
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
  if (regNumber) {
    const existingNIN = await db.supplier.findUnique({
      where: {
        regNumber,
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
    const newSupplier = await db.supplier.create({
      data:{
        supplierType,
        name,
        contactPerson,
        phone,
        email,
        country,
        location,
        website,
        taxPin,
        regNumber,
        bankAccountNumber,
        bankName,
        paymentTerms,
        logo,
        rating,
        notes
    },
    })
    
    return res.status(201).json(newSupplier);
  } catch (error) {
    console.log(error);
    
  }


}
export async function getSupplier(req: Request, res: Response) {
 try {
  const suppliers = await db.supplier.findMany({
    orderBy:{
      createdAt:"desc"
    }
   })
  
    return res.status(200).json(suppliers);
 } catch (error) {
  console.log(error);
  
 }
}

export async function getSupplierById(req: Request, res: Response) {
  const { id } = req.params;
   try {
    const supplier = await db.supplier.findUnique({
      where:{
        id,
      },
    })
    return res.status(200).json(supplier);
   } catch (error) {
    
   }
 

 
}
