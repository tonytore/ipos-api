import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createUnits(req: Request, res: Response) {
  const { 
    name,
    abbreviation,
    slug
} = req.body;
  try {
    const existingSlug = await db.unit.findUnique({
        where: {
          slug,
        },
      });
      if (existingSlug) {
        return res
          .status(400)
          .json({
            message: `unit with this slug ${slug} already exists`,
          });
      }
    const newUnit = await db.unit.create({
      data: {
        name,
        abbreviation,
        slug
      },
    });
    return res.status(201).json({
      data: newUnit,
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

export async function getUnits(req: Request, res:Response){
    try {
        const units = await db.unit.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:units,
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


export async function getUnitById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const unit = await db.unit.findUnique({
        where: {
          id,
        },
      });
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
 
      return res.status(200).json({
          data:unit,
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


  export async function updateUnitById(req: Request, res: Response) {
    const { id } = req.params;
    const {
         name,
        abbreviation,
        slug
     } = req.body;
    try {

      const existingUnit = await db.unit.findUnique({
        where: {
          id,
        },
      });
      if (!existingUnit) {
        return res.status(404).json({ message: "Unit not found" });
      }

      if(slug && slug !== existingUnit.slug) {
        const existingSlug = await db.unit.findUnique({
          where: {
            slug,
          },
        });
        if (existingSlug) {
          return res.status(404).json({ message: `Unit name ${name} is already exist` });
        }
    
    }
     
      const updateUnit = await db.unit.update({
        where:{
            id
        },
        data:{
            name,
            abbreviation,
            slug
        }
      })
      return res.status(200).json({
          data:updateUnit,
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
  export async function DeleteUnit(req: Request, res: Response) {
    const {id} = req.params
    const existingUnit= await db.unit.findUnique({
        where: {
            id,
        },
    })
    if(!existingUnit){
        return res.status(404).json({
            data:null,
            message: "Unit not found"
        })
    }

   await db.unit.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}