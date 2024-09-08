import { SaleType, paymentMethod } from "@prisma/client";

export interface SaleRequestBody {
  customerId: string;
  customerName: string;
  customerEmail: string;
  saleAmount: number;
  balanceAmount: number;
  paidAmount: number;
  saleType: SaleType;
  paymentMethod: paymentMethod;
  transactionCode: string;
}


export interface SaleItems {
    saleId:string
    productId:string
    qty:number
    ProductPrice:number
    productName:string
    productImage:string
}
