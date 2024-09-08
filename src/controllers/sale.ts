import { db } from "@/db/db";
import { SaleRequestBody } from "@/types/types";
import { generateSaleNumber } from "@/utils/generateSaleNumber";
import { SaleItem } from "@prisma/client";
import { Request, Response } from "express";

export async function createSale(req: Request, res: Response) {
  const { 
    customerId,
    customerName,
    customerEmail,
    paymentMethod,
    saleAmount,
    saleType,
    balanceAmount,
    paidAmount,
    transactionCode,
   
  }: SaleRequestBody = req.body;
  
  try {
    const saleId = await db.$transaction(async (transaction) => {
      const createdSale = await transaction.sale.create({
        data: {
          customerId,
          customerName,
          customerEmail,
          paymentMethod,
          saleNumber: generateSaleNumber(),
          saleAmount,
          saleType,
          balanceAmount,
          paidAmount,
          transactionCode,
        },
      });
 
    //  if(saleItems && saleItems.length > 0 ){
    //   for (const item of saleItems) {
     
    //     const updatedProduct = await transaction.product.update({
    //       where: { id: item.productId },
    //       data: {
    //         stockQty: {
    //           decrement: item.qty,
    //         },
    //       },
    //     });
 
    //     if (!updatedProduct) {
    //       return res.status(500).json({
    //         error: "Failed to Update Product Quantity",
    //         data: null,
    //       });
    //     }
 
    //     const saleItem = await transaction.saleItem.create({
    //       data: {
    //         saleId: createdSale.id,
    //         productId: item.productId,
    //         qty: item.qty,
    //         ProductPrice: item.ProductPrice,
    //         productName: item.productName,
    //         productImage: item.productImage,
    //       },
    //     });
 
    //     if (!saleItem) {
    //       return res.status(500).json({
    //         error: "Failed to Update Sale Item",
    //         data: null,
    //       });
    //     }
    //   }
    //  }

      return createdSale.id;
    });
 
    const saleDetails = await db.sale.findUnique({
      where: {
        id: saleId as string,
      },
      include: {
        SaleItems: true,
      },
    });
   
    return res.status(201).json(saleDetails);
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}

export async function getSales(req: Request, res:Response){
  try {
      const sales = await db.sale.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          SaleItems: true,
        },
      });
   
     return res.status(200).json({
      data:sales,
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


export async function getSaleById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const sale = await db.sale.findUnique({
      where: {
        id,
      },
    });
    if (!sale) {
      return res.status(404).json({ message: `Sale with this id ${id} not found"`});
    }

    return res.status(200).json({
        data:sale,
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

export async function DeleteSale(req: Request, res: Response) {
  const {id} = req.params
  const existingSale = await db.sale.findUnique({
      where: {
          id,
      },
  })
  if(!existingSale){
      return res.status(404).json({
          data:null,
          message: "Sale not found"
      })
  }

 await db.sale.delete({
  where: {
      id
  }
 })
 return res.status(200).json({
  success: true,
  error:null
})
  
}


export async function createSaleItems(req: Request, res: Response) {
  const {
    saleId,
    productId,
    qty,
    ProductPrice,
    productName,
    productImage
  } = req.body
  try {
     
            const updatedProduct = await db.product.update({
              where: { id:productId },
              data: {
                stockQty: {
                  decrement: qty,
                },
              },
            });
     
            if (!updatedProduct) {
              return res.status(500).json({
                error: "Failed to Update Product Quantity",
                data: null,
              });
            }
     
            const saleItem = await db.saleItem.create({
              data: {
                saleId,
                productId,
                qty,
                ProductPrice,
                productName,
                productImage
              },
            });
             
      return res.status(201).json(saleItem);
    } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      data: null,
    })
    

}

}