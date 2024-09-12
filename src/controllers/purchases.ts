import { db } from "@/db/db";
import { PurchaseOrderProp, createAdjustmentProps } from "@/types/types";
import { generateSaleNumber } from "@/utils/generateSaleNumber";
import { NotificationStatus } from "@prisma/client";
import { Request, Response } from "express";

export async function createPurchaseOrder(req: Request, res: Response) {
  const { 
    supplierId,
    status,
    discount,
    notes,
    tax,
    totalAmount,
    balanceAmount,
    shippingCost,
    items 
  }: PurchaseOrderProp = req.body;
  try {
    const purchaseId = await db.$transaction(async (transaction) => {
      const purchase = await transaction.purchaseOrder.create({
        data: {
          supplierId,
          status,
          discount,
          notes,
          tax,
          totalAmount,
          balanceAmount,
          shippingCost,
          refNo: generateSaleNumber(),
          
        },
      });

      for (const item of items) {
       
        const updateProduct = await transaction.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQty: {
              increment: item.quantity
            },
          },
        });
        if (!updateProduct) {
          return res.status(500).json({
            error: `Faild to update Product Stock for product ID: ${item.productId}`,
            data: null,
          });
        }

   
          const message = `New stock FoR ${updateProduct.name}. Current stock: ${updateProduct.stockQty}.`
          
          const statusText = "New Stock"
          const status: NotificationStatus = "INFO"

          const newNotification = {
            message,
            statusText,
            status,
          };

          await db.notification.create({
            data: newNotification
          })
        

        const purchaseItems = await transaction.purchaseOrderItem.create({
          data:{
            purchaseOrderId:purchase.id,
            productId: item.productId,
            productName: item.productName,
            currentStock: updateProduct.stockQty,
            quantity: item.quantity,
            unitCost : item.unitCost,
            subTotal :item.subTotal
          }
        })

        if(!purchaseItems){
          return res
          .status(500)
          .json({ 
            message: `Faild to create purchase fot ${item.productId}`,
          data:null
         });
      }
        }
      
     
   

      return purchase.id;
    });

    const purchaseDetails = await db.adjustment.findUnique({
      where: {
        id: purchaseId as string,
      },
      include: {
        items: true,
      },
    });
   
    return res.status(201).json({
      data:purchaseDetails,
      error:null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

export async function getPurchase(req: Request, res: Response) {
  try {
    const orders = await db.purchaseOrder.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
        supplier: true,
      },
    });

    return res.status(200).json({
      data: orders,
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


