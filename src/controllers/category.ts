import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCategory(req: Request, res: Response) {
  const { 
    name,
    slug
} = req.body;
  try {

    
    const existingSlug = await db.category.findUnique({
        where: {
          slug,
        },
      });
      if (existingSlug) {
        return res
          .status(400)
          .json({
            message: `Category with this name ${name} already exists`,
          });
      }
    const newCategory = await db.category.create({
      data: {
        name,
        slug
      },
    });
    return res.status(201).json({
      data: newCategory,
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

export async function getCategory(req: Request, res:Response){
    try {
        const categories = await db.category.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:categories,
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


export async function getCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const category = await db.category.findUnique({
        where: {
          id,
        },
      });
      if (!category) {
        return res.status(404).json({ message: `category with this is ${id} not found` });
      }
 
      return res.status(200).json({
          data:category,
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


  export async function updateCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    const {
         name,
        slug
     } = req.body;
    try {

      const existingCategory = await db.category.findUnique({
        where: {
          id,
        },
      });
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }


      if(slug && slug !== existingCategory.slug) {
        const existingSlug = await db.category.findUnique({
          where: {
            slug,
          },
        });
        if (existingSlug) {
          return res.status(404).json({ message: `category name ${name} is already exist not found` });
        }
    
    }
     
 
      const updateCategory = await db.category.update({
        where:{
            id
        },
        data:{
            name,
            slug
        }
      })
      return res.status(200).json({
          data:updateCategory,
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
  export async function DeleteCategory(req: Request, res: Response) {
    const {id} = req.params
    const existingCategory= await db.category.findUnique({
        where: {
            id,
        },
    })
    if(!existingCategory){
        return res.status(404).json({
            data:null,
            message: "Category not found"
        })
    }

   await db.category.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}