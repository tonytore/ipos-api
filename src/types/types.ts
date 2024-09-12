import { PurchaseOrderStatus, SaleType, paymentMethod } from "@prisma/client";

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

export interface AdjustmentItems {
  productId: string;
  adjustmentId: string;
  productName: string;
  currentStock: number;
  type: string;
  quantity: number;
}

export interface createAdjustmentProps {
  reason:string
  items:AdjustmentItems[];
}

export type PurchaseOrderProp = {
  supplierId: string;
  discount?: number;
  notes?: string;
  tax?: number;
  totalAmount: number;
  balanceAmount: number;
  shippingCost?: number;
  status:PurchaseOrderStatus;
  items: PurchaseOrderItem[];
};

export type PurchaseOrderItem = {
  productId: string;
  purchaseOrderId: string;

  productName: string;
  quantity: number;
  unitCost: number;
  subTotal: number;
  currentStock: number;
}