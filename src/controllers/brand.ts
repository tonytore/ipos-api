import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createBrands(req: Request, res: Response) {
  const { 
    name,
    slug
} = req.body;
  try {
    const existingSlug = await db.brand.findUnique({
        where: {
          slug,
        },
      });
      if (existingSlug) {
        return res
          .status(400)
          .json({
            message: `Brand with this name ${name} already exists`,
          });
      }
    const newBrand = await db.brand.create({
      data: {
        name,
        slug
      },
    });
    return res.status(201).json({
      data: newBrand,
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

export async function getBrands(req: Request, res:Response){
    try {
        const brands = await db.brand.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:brands,
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


export async function getBrandById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const brand = await db.brand.findUnique({
        where: {
          id,
        },
      });
      if (!brand) {
        return res.status(404).json({ message: `Brand with this id ${id} not found"`});
      }
 
      return res.status(200).json({
          data:brand,
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


  export async function updateBrandById(req: Request, res: Response) {
    const { id } = req.params;
    const {
         name,
        slug
     } = req.body;
    try {

      const existingBrand = await db.brand.findUnique({
        where: {
          id,
        },
      });
      if (!existingBrand) {
        return res.status(404).json({ message: `Brand with this id ${id} not found"` });
      }

      if(slug && slug !== existingBrand.slug) {
        const existingSlug = await db.brand.findUnique({
          where: {
            slug,
          },
        });
        if (existingSlug) {
          return res.status(404).json({ message: `Brand name ${name} is already exist` });
        }
    
    
    }
     
      const updateBrand =await db.brand.update({
        where:{
            id
        },
        data:{
            name,
            slug
        }
      })
      return res.status(200).json({
          data:updateBrand,
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
  export async function DeleteBrand(req: Request, res: Response) {
    const {id} = req.params
    const existingBrand= await db.brand.findUnique({
        where: {
            id,
        },
    })
    if(!existingBrand){
        return res.status(404).json({
            data:null,
            message: "Brand not found"
        })
    }

   await db.brand.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}