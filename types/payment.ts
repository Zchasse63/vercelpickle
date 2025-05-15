/**
 * Payment method type
 */
export type PaymentMethodType = "credit_card" | "debit_card" | "bank_transfer" | "paypal" | "other";

/**
 * Payment method interface
 */
export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  isDefault: boolean;
  // Credit card specific fields
  cardName?: string;
  cardNumber?: string;
  cardNumberMasked?: string;
  expiry?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
  // Bank transfer specific fields
  accountName?: string;
  accountNumber?: string;
  accountNumberMasked?: string;
  routingNumber?: string;
  bankName?: string;
  // PayPal specific fields
  email?: string;
  // Common fields
  billingAddressId?: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Payment method form data interface
 */
export interface PaymentMethodFormData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  isDefault: boolean;
}

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethodId: string;
  paymentMethod: PaymentMethodType;
  transactionId?: string;
  transactionDate: number;
  notes?: string;
}
