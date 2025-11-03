export interface ReceiptItem {
  description: string;
  quantity: number;
  price: number;
}

export interface ReceiptCalculation {
  items: ReceiptItem[];
  subtotal: number;
  vat: number;
  total: number;
}

export function calculateReceipt(items: ReceiptItem[], vatRate: number = 0): ReceiptCalculation {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const vat = (subtotal * vatRate) / 100;
  const total = subtotal + vat;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    vat: Math.round(vat * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function generateReceiptNumber(): string {
  return `RC-${Date.now()}`;
}