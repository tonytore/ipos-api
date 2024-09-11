import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createPayee(req: Request, res: Response) {
  const { 
    name,
    phone
} = req.body;
  try {

    
    const existingPhone = await db.payee.findUnique({
        where: {
          phone,
        },
      });
      if (existingPhone) {
        return res
          .status(400)
          .json({
            message: `Payee with this phone ${phone} already exists`,
          });
      }
    const newPayee = await db.payee.create({
      data: {
        name,
        phone
      },
    });
    return res.status(201).json({
      data: newPayee,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

export async function getPayee(req: Request, res:Response){
    try {
        const payees = await db.payee.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:payees,
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


export async function getPayeeById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const payee = await db.payee.findUnique({
        where: {
          id,
        },
      });
      if (!payee) {
        return res.status(404).json({ message: `payee with this is ${id} not found` });
      }
 
      return res.status(200).json({
          data:payee,
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


  export async function updatePayeeById(req: Request, res: Response) {
    const { id } = req.params;
    const {
         name,
        phone
     } = req.body;
    try {

      const existingPayee = await db.payee.findUnique({
        where: {
          id,
        },
      });
      if (!existingPayee) {
        return res.status(404).json({ message: "Payee not found" });
      }


      if(phone && phone !== existingPayee.phone) {
        const existingPayee = await db.payee.findUnique({
          where: {
            phone,
          },
        });
        if (existingPayee) {
          return res.status(404).json({ message: `payee name ${phone} is already exist` });
        }
    
    }
     
 
      const updatePayee = await db.payee.update({
        where:{
            id
        },
        data:{
            name,
            phone
        }
      })
      return res.status(200).json({
          data:updatePayee,
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
  export async function DeletePayee(req: Request, res: Response) {
    const {id} = req.params
    const existingPayee = await db.payee.findUnique({
        where: {
            id,
        },
    })
    if(!existingPayee){
        return res.status(404).json({
            data:null,
            message: "Payee not found"
        })
    }

   await db.payee.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}