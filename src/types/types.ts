import { SaleType, paymentMethod } from "@prisma/client";

export interface SaleRequestBody {
  customerId: string;
  shopId: string
  customerName: string;
  customerEmail: string;
  saleAmount: number;
  balanceAmount: number;
  paidAmount: number;
  saleType: SaleType;
  paymentMethod: paymentMethod;
  transactionCode: string;
  SaleItems:SaleItems[]
}


export interface SaleItems {
    productId:string
    qty:number
    ProductPrice:number
    productName:string
    productImage:string
}
