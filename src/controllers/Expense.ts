import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createExpense(req: Request, res: Response) {
  const { 
    title,
    amount,
    description,
    attachments,
    expenseDate,
    payeeId,
    categoryId,
    shopId
} = req.body;
  try {


    const newExpense = await db.expense.create({
      data: {
        title,
    amount,
    description,
    attachments,
    expenseDate,
    payeeId,
    categoryId,
    shopId
      },
    });
    return res.status(201).json({
      data: newExpense,
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

export async function getExpense(req: Request, res:Response){
    try {
        const expenses = await db.expense.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:expenses,
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


export async function getExpenseById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const expense = await db.expense.findUnique({
        where: {
          id,
        },
      });
      if (!expense) {
        return res.status(404).json({ message: `expense with this is ${id} not found` });
      }
 
      return res.status(200).json({
          data:expense,
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


  export async function updateExpenseById(req: Request, res: Response) {
    const { id } = req.params;
    const {
      title,
      amount,
      description,
      attachments,
      expenseDate,
      payeeId,
      categoryId,
      shopId
     } = req.body;
    try {

      const existingExpense = await db.expense.findUnique({
        where: {
          id,
        },
      });
      if (!existingExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
 
      const updateExpense = await db.expense.update({
        where:{
            id
        },
        data:{
          title,
          amount,
          description,
          attachments,
          expenseDate,
          payeeId,
          categoryId,
          shopId
        }
      })
      return res.status(200).json({
          data:updateExpense,
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
  export async function DeleteExpense(req: Request, res: Response) {
    const {id} = req.params
    const existingExpense = await db.expense.findUnique({
        where: {
            id,
        },
    })
    if(!existingExpense){
        return res.status(404).json({
            data:null,
            message: "Expense not found"
        })
    }

   await db.expense.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}