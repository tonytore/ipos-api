import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createExpenseCategory(req: Request, res: Response) {
  const { 
    name,
    slug
} = req.body;
  try {

    
    const existingSlug = await db.expenseCategory.findUnique({
        where: {
          slug,
        },
      });
      if (existingSlug) {
        return res
          .status(400)
          .json({
            message: `Category with this slug ${slug} already exists`,
          });
      }
    const newExpenseCategory = await db.expenseCategory.create({
      data: {
        name,
        slug
      },
    });
    return res.status(201).json({
      data: newExpenseCategory,
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

export async function getExpenseCategory(req: Request, res:Response){
    try {
        const ExpenseCategories = await db.expenseCategory.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:ExpenseCategories,
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


export async function getExpenseCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const ExpenseCategory = await db.expenseCategory.findUnique({
        where: {
          id,
        },
      });
      if (!ExpenseCategory) {
        return res.status(404).json({ message: `category with this is ${id} not found` });
      }
 
      return res.status(200).json({
          data:ExpenseCategory,
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


  export async function updateExpenseCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    const {
         name,
        slug
     } = req.body;
    try {

      const existingExpenseCategory = await db.expenseCategory.findUnique({
        where: {
          id,
        },
      });
      if (!existingExpenseCategory) {
        return res.status(404).json({ message: "Category not found" });
      }


      if(slug && slug !== existingExpenseCategory.slug) {
        const existingSlug = await db.expenseCategory.findUnique({
          where: {
            slug,
          },
        });
        if (existingSlug) {
          return res.status(404).json({ message: `category name ${name} is already exist not found` });
        }
    
    }
     
 
      const updateExpenseCategory = await db.expenseCategory.update({
        where:{
            id
        },
        data:{
            name,
            slug
        }
      })
      return res.status(200).json({
          data:updateExpenseCategory,
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
  export async function DeleteExpenseCategory(req: Request, res: Response) {
    const {id} = req.params
    const existingExpenseCategory= await db.expenseCategory.findUnique({
        where: {
            id,
        },
    })
    if(!existingExpenseCategory){
        return res.status(404).json({
            data:null,
            message: "Category not found"
        })
    }

   await db.expenseCategory.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}