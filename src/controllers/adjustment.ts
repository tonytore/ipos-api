import { db } from "@/db/db";
import { createAdjustmentProps } from "@/types/types";
import { generateSaleNumber } from "@/utils/generateSaleNumber";
import { NotificationStatus } from "@prisma/client";
import { Request, Response } from "express";

export async function createAdjustment(req: Request, res: Response) {
  const { reason, items }: createAdjustmentProps = req.body;
  try {
    const adjustmentId = await db.$transaction(async (transaction) => {
      const adjustment = await transaction.adjustment.create({
        data: {
          reason,
          refNo: generateSaleNumber(),
          
        },
      });

      for (const item of items) {
        let query;
        if (item.type === "Addition") {
          query = {
            increment: item.quantity,
          };
        } else if (item.type === "Subtraction") {
          query = {
            decrement: item.quantity,
          };
        }
        const updateProduct = await transaction.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQty: query,
          },
        });
        if (!updateProduct) {
          return res.status(500).json({
            error: `Faild to update Product Stock for product ID: ${item.productId}`,
            data: null,
          });
        }

        if (updateProduct.stockQty < updateProduct.alertQty) {
          const message =
            updateProduct.stockQty === 0
              ? `The stock of ${updateProduct.name} is out. Current stock: ${updateProduct.stockQty}.`
              : `The stock of ${updateProduct.name} has gone below threshold. Current stock: ${updateProduct.stockQty}.`;
          const statusText =
            updateProduct.stockQty === 0 ? `Stock Out` : "Warning";
          const status: NotificationStatus =
            updateProduct.stockQty === 0 ? "DANGER" : "WARNING";

          const newNotification = {
            message,
            statusText,
            status,
          };

          await db.notification.create({
            data: newNotification
          })
        }

        const adjustmentItems = await transaction.adjustmentItems.create({
          data:{
            adjustmentId:adjustment.id,
            productId: item.productId,
            productName: item.productName,
            currentStock: updateProduct.stockQty,
            type: item.type,
            quantity: item.quantity,
          }
        })

        if(!adjustmentItems){
          return res
          .status(500)
          .json({ 
            message: `Faild to create adjustment fot ${item.productId}`,
          data:null
         });
      }
        }
      
     
   

      return adjustment.id;
    });
    const adjustmentDetails = await db.adjustment.findUnique({
      where: {
        id: adjustmentId as string,
      },
      include: {
        items: true,
      },
    });
   
    return res.status(201).json({
      data:adjustmentDetails,
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

export async function getAdjustment(req: Request, res: Response) {
  try {
    const adjustments = await db.adjustment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: adjustments,
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


