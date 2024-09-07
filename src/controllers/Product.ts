import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createProducts(req: Request, res: Response) {
  const { 
    name,
    description,
    batchNumber,
    barCode,
    tax,
    image,
    alertQty,
    stockQty,
    price,
    buyerPrice,
    sku,
    productCode,
    slug,
    supplierId,
    unitId,
    brandId,
    categoryId,
    expiryDate
} = req.body;
  try {

  if(barCode){
    const existingBarCode = await db.product.findUnique({
      where: {
        barCode,
      },
    });
    if (existingBarCode) {
      return res
        .status(400)
        .json({
          message: `ProductBarCode with this name ${barCode} already exists`,
        });
    }
  }
  const existingSku = await db.product.findUnique({
    where: {
      sku,
    },
  });
  if (existingSku) {
    return res
      .status(400)
      .json({
        message: `sku with this name ${sku} already exists`,
      });
  }

  const existingProductCode = await db.product.findUnique({
    where: {
      productCode,
    },
  });
  if (existingProductCode) {
    return res
      .status(400)
      .json({
        message: `ProductCode with this name ${productCode} already exists`,
      });
  }
  const existingSlug = await db.product.findUnique({
    where: {
      slug,
    },
  });
  if (existingSlug) {
    return res
      .status(400)
      .json({
        message: `productSlug with this name ${slug} already exists`,
      });
  }
    const newProduct = await db.product.create({
      data: {
        name,
    description,
    batchNumber,
    barCode,
    image : image ? image : "https://utfs.io/f/c61ec63c-42b1-4939-a7fb-ed04d43e23ee-2558r.png",
    tax,
    alertQty,
    stockQty,
    price,
    buyerPrice,
    sku,
    productCode,
    slug,
    supplierId,
    unitId,
    brandId,
    categoryId,
    expiryDate
      },
    });
    return res.status(201).json({
      data: newProduct,
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

export async function getProducts(req: Request, res:Response){
    try {
        const products = await db.product.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });
     
       return res.status(200).json({
        data:products,
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


export async function getProductById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await db.product.findUnique({
        where: {
          id,
        },
      });
      if (!product) {
        return res.status(404).json({ message: `product with this id ${id} not found` });
      }
 
      return res.status(200).json({
          data:product,
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


  export async function updateProductById(req: Request, res: Response) {
    const { id } = req.params;
    const {
      name,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQty,
      stockQty,
      price,
      buyerPrice,
      sku,
      productCode,
      slug,
      expiryDate
     } = req.body;
    try {
      const existingProduct = await db.product.findUnique({
        where: {
          id,
        },
      });
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      if(barCode && barCode !== existingProduct.barCode) {
        const existingBarCode = await db.product.findUnique({
          where: {
            barCode,
          },
        });
        if (existingBarCode) {
          return res
           .status(400)
           .json({
              message: `ProductBarCode with this name ${barCode} already exists`,
            });
        }
      }
 
      if(sku && sku !== existingProduct.sku) {
        const existingSku = await db.product.findUnique({
          where: {
            sku,
          },
        });
        if (existingSku) {
          return res
            .status(400)
            .json({
              message: `sku with this name ${sku} already exists`,
            });
        }
      
      }
      
      if(productCode && productCode !== existingProduct.productCode) {
        const existingProductCode = await db.product.findUnique({
          where: {
            productCode,
          },
        });
        if (existingProductCode) {
          return res
            .status(400)
            .json({
              message: `ProductCode with this name ${productCode} already exists`,
            });
        }
      
      }  

      if(slug && slug !== existingProduct.slug) {
        const existingSlug = await db.product.findUnique({
          where: {
            slug,
          },
        });
        if (existingSlug) {
          return res.status(404).json({ message: `slug with this name ${slug} already exists`, });
        }
    }
   
  
      const updateProduct =await db.product.update({
        where:{
            id
        },
        data:{
          name,
          description,
          batchNumber,
          barCode,
          image,
          tax,
          alertQty,
          stockQty,
          price,
          buyerPrice,
          sku,
          productCode,
          slug,
          expiryDate
        }
      })
      return res.status(200).json({
          data:updateProduct,
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
  export async function DeleteProduct(req: Request, res: Response) {
    const {id} = req.params
    const existingProduct= await db.product.findUnique({
        where: {
            id,
        },
    })
    if(!existingProduct){
        return res.status(404).json({
            data:null,
            message: "Product not found"
        })
    }

   await db.product.delete({
    where: {
        id
    }
   })
   return res.status(200).json({
    success: true,
    error:null
})
    
}