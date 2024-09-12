import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createNotification(req: Request, res: Response) {
  const { 
    message,
status,
statusText,
read

} = req.body;
  try {


  const newNotification = {
    message,
    status,
    statusText,
    read
  }
   await db.notification.create({
    data: newNotification
  });
 
return res.status(201).json({
  data:newNotification,
  error:null
})

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

export async function getNotification(req: Request, res:Response){
    try {
        const notifications = await db.notification.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:notifications,
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
  export async function updateNotificationById(req: Request, res: Response) {
    const { id } = req.params;
    const {read}  = req.body;
  
    try {

      const existingNotification = await db.notification.findUnique({
        where: {
          id,
        },
      });
      if (!existingNotification) {
        return res.status(404).json({ 
          error: "Notification not found",
          data:null
         });
      }


     
 
      const updateNotification = await db.notification.update({
        where:{
            id
        },
        data:{
          read
        }
      })
      return res.status(200).json({
          data:updateNotification,
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
  export async function DeleteNotification(req: Request, res: Response) {
    const {id} = req.params
    const notification= await db.notification.findUnique({
        where: {
            id,
        },
    })
    if(!notification){
        return res.status(404).json({
            data:null,
            message: "Notification not found"
        })
    }

   await db.notification.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}