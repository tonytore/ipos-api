import { db } from "@/db/db";
import { SaleRequestBody } from "@/types/types";
import { generateSaleNumber } from "@/utils/generateSaleNumber";

import { Request, Response } from "express";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
} from "date-fns";

export async function createSale(req: Request, res: Response) {
  const { 
    customerId,
    shopId,
    customerName,
    customerEmail,
    paymentMethod,
    saleAmount,
    saleType,
    balanceAmount,
    paidAmount,
    transactionCode,
    SaleItems
  }: SaleRequestBody = req.body;

  
  try {
    const saleId = await db.$transaction(async (transaction) => {
      if(balanceAmount > 0) {
       const existingCustomer = await transaction.customer.findUnique({
        where: { id: customerId },
       })

       if(!existingCustomer){
         return res.status(404).json({
            error:"Customer not found",
            data:null
          })
        }

        if(balanceAmount > existingCustomer.maxCreditLimit){
          return res.status(403).json({
            error:`Credit limit exceeded(This customer is not Eligible for Credit)- ${balanceAmount}`,
            data:null
          })
        }
       

        const updateCustomer = await transaction.customer.update({
          where: { id: customerId },
          data: {
            unpaidCreditAmount: (existingCustomer.unpaidCreditAmount ?? 0) + balanceAmount,
            maxCreditLimit:{
              decrement: balanceAmount
            }
          },
        })
        if(!updateCustomer) {
          return res.status(500).json({
            error:"Faild to update Customer Credit details",
            data:null
          })
        }
      }
      
      const createdSale = await transaction.sale.create({
        data: {
          customerId,
          shopId,
          customerName,
          customerEmail,
          paymentMethod,
          saleNumber: generateSaleNumber(),
          saleAmount,
          saleType,
          balanceAmount,
          paidAmount,
          transactionCode,
          SaleItems: {
            create: SaleItems, 
          },
        },
        include:{
          SaleItems:{
            select:{
              productId:true,
              qty:true,
              ProductPrice:true,
              productName:true,
              productImage:true
            }
          }
        }
      });
 
    

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

export async function getShopSales(req: Request, res: Response) {
  let { shopId } = req.query;
  if (Array.isArray(shopId)) {
    shopId = shopId[0]; // Take the first value if it's an array
  }

  // Check if shopId is valid
  if (!shopId || typeof shopId !== 'string') {
    return res.status(400).json({ error: 'Invalid shopId provided' });
  }

const existingShop = await db.shop.findUnique({
  where:{
    id: shopId,
  }
})
if(!existingShop) {
  return res.status(404).json({ error: 'Shop not found', data:null });
}
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
 
  try {
    // Fetch sales for different periods
    const categorizeSales = async (sales: any[]) => {
      return {
        total:sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount > 0
        ),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILEMONEY"
        ),
        salesByHandCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
      };
    };
 
    const salesToday = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
 
    const salesThisWeek = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });
 
    const salesThisMonth = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });
 
    const salesAllTime = await db.sale.findMany({
      where: {
        shopId,
      },
    });
 
    res.status(200).json({
      today: await categorizeSales(salesToday),
      thisWeek: await categorizeSales(salesThisWeek),
      thisMonth: await categorizeSales(salesThisMonth),
      allTime: await categorizeSales(salesAllTime),
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

export async function getShopsSales(req: Request, res: Response) {
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
 
  try {
    const fetchSalesData = async (startDate: Date, endDate: Date)=>{
      return await db.sale.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select:{
          shopId: true,
          saleAmount: true,
          balanceAmount: true,
          paymentMethod: true,
          saleType: true,
         
        }
      });
    }
    // Fetch all sales and group by shopId for different periods
    const categorizeSales = (sales: any[]) => {
      return {
        totalSales:sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount > 0
        ),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILEMONEY"
        ),
        salesByHandCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
      };
    };
 
    const salesToday = await fetchSalesData(todayStart,todayEnd)
    const salesThisWeek = await fetchSalesData(weekStart,weekEnd)
    const salesThisMonth = await fetchSalesData(monthStart,monthEnd) 
    const salesAllTime = await db.sale.findMany({
      select:{
        shopId: true,
        saleAmount: true,
        balanceAmount: true,
        paymentMethod: true,
        saleType: true,
      }
    })
    res.status(200).json({
      today: categorizeSales(salesToday),
      thisWeek: categorizeSales(salesThisWeek),
      thisMonth: categorizeSales(salesThisMonth),
      allTime: categorizeSales(salesAllTime),
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
// export async function createSaleItems(req: Request, res: Response) {
//   const {
//     saleId,
//     productId,
//     qty,
//     ProductPrice,
//     productName,
//     productImage
//   } = req.body
//   try {
     
//             const updatedProduct = await db.product.update({
//               where: { id:productId },
//               data: {
//                 stockQty: {
//                   decrement: qty,
//                 },
//               },
//             });
     
//             if (!updatedProduct) {
//               return res.status(500).json({
//                 error: "Failed to Update Product Quantity",
//                 data: null,
//               });
//             }
     
//             const saleItem = await db.saleItem.create({
//               data: {
//                 saleId,
//                 productId,
//                 qty,
//                 ProductPrice,
//                 productName,
//                 productImage
//               },
//             });
             
//       return res.status(201).json(saleItem);
//     } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "Something went wrong",
//       data: null,
//     })
    

// }

// }