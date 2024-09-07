import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createShops(req: Request, res: Response) {
  const { name, slug, location, adminId, attendantId } = req.body;
  try {
    const existingShop = await db.shop.findUnique({
        where: {
          slug,
        },
      });
      if (existingShop) {
        return res
          .status(400)
          .json({
            message: `shop with this name ${name} already exists`,
          });
      }
    const newShop = await db.shop.create({
      data: {
        name,
        slug,
        location,
        adminId,
        attendantId,
      },
    });
    return res.status(201).json({
      data: newShop,
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

export async function getShops(req: Request, res:Response){
    try {
        const shops = await db.shop.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:shops,
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

export async function getShopAttendants(req: Request, res:Response){
    const {id} = req.params
    try {
        const existingShop = await db.shop.findUnique({
          where: {
            id
          },
        });
     if(!existingShop){
        return res.status(404).json({
            data:null,
          error: `shop with id ${id} not found`,
        });
     }
    const attendants = await db.user.findMany({
        where: {
           id:{
             in: existingShop.attendantId
           }
        }
    })
       return res.status(200).json({
        data:attendants,
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

export async function getShopById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const shop = await db.shop.findUnique({
        where: {
          id,
        },
      });
      if (!shop) {
        return res.status(404).json({ message: "User not found" });
      }
 
      return res.status(200).json({
          data:shop,
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


  export async function updateShopById(req: Request, res: Response) {
    const { id } = req.params;
    const {     
      name,
      slug,
      location,

     } = req.body;
    try {
      const existingShop = await db.shop.findUnique({
        where: {
          id,
        },
      });

      if (!existingShop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      if(slug && slug !== existingShop.slug) {
        const existingSlug = await db.shop.findUnique({
          where: {
            slug,
          },
        });
        if (existingSlug) {
          return res.status(404).json({ message: `Shop name ${name} is already exist` });
        }
    }
      const updateShop =await db.shop.update({
        where:{
            id
        },
        data:{
          name,
          slug,
          location,
        
        }
      })
      return res.status(200).json({
          data:updateShop,
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
  export async function DeleteShop(req: Request, res: Response) {
    const {id} = req.params
    const existingShop = await db.shop.findUnique({
        where: {
            id,
        },
    })
    if(!existingShop){
        return res.status(404).json({
            data:null,
            message: "Shop not found"
        })
    }

   await db.shop.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}